import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  CATALOG_READER,
  type CatalogReader,
} from '../../../catalog/public/catalog-reader.port.js';
import {
  CART_READER,
  CART_WRITER,
  type CartReader,
  type CartWriter,
} from '../../../cart/public/cart-access.port.js';
import {
  INVENTORY_PORT,
  type InventoryPort,
  type ReservationItem,
} from '../../../inventory/public/inventory.port.js';
import {
  TRANSACTION_MANAGER,
  type TransactionManager,
} from '../../../../shared/application/transaction.js';
import type { DeliveryMethodCode } from '../../domain/delivery-method.js';
import { deliveryFeeOf } from '../../domain/delivery-method.js';
import { Order } from '../../domain/entities/order.js';
import { OrderItem } from '../../domain/entities/order-item.js';
import { EmptyCartError } from '../../domain/errors/empty-cart.error.js';
import { ProductUnavailableError } from '../../domain/errors/product-unavailable.error.js';
import type { ShippingAddress } from '../../domain/shipping-address.js';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../ports/order.repository.port.js';
import { toOrderView, type OrderView } from '../results/order-view.js';

export interface PlaceOrderCommand {
  customerId: string;
  deliveryMethod: DeliveryMethodCode;
  shippingAddress: ShippingAddress;
}

@Injectable()
export class PlaceOrderUseCase {
  constructor(
    @Inject(CART_READER) private readonly cartReader: CartReader,
    @Inject(CART_WRITER) private readonly cartWriter: CartWriter,
    @Inject(CATALOG_READER) private readonly catalog: CatalogReader,
    @Inject(INVENTORY_PORT) private readonly inventory: InventoryPort,
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactions: TransactionManager,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<OrderView> {
    const lines = await this.cartReader.getItems(command.customerId);
    if (lines.length === 0) {
      throw new EmptyCartError();
    }

    const items: OrderItem[] = [];
    let subtotalMinor = 0;
    for (const line of lines) {
      const product = await this.catalog.getActiveProduct(line.productId);
      if (!product) {
        throw new ProductUnavailableError();
      }
      const item = new OrderItem(
        randomUUID(),
        product.id,
        product.name,
        product.priceMinor,
        line.quantity,
      );
      items.push(item);
      subtotalMinor += item.lineTotalMinor;
    }

    const order = Order.create({
      customerId: command.customerId,
      items,
      subtotalMinor,
      discountMinor: 0,
      deliveryMethod: command.deliveryMethod,
      deliveryFeeMinor: deliveryFeeOf(command.deliveryMethod),
      shippingAddress: command.shippingAddress,
    });

    const reservationItems: ReservationItem[] = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    await this.transactions.run(async (tx) => {
      await this.inventory.reserveItems(order.id, reservationItems, tx);
      await this.orders.create(order, tx);
      await this.cartWriter.clear(command.customerId, tx);
    });

    return toOrderView(order);
  }
}
