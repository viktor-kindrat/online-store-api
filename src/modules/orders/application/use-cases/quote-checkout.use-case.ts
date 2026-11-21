import { Inject, Injectable } from '@nestjs/common';
import {
  CATALOG_READER,
  type CatalogReader,
} from '../../../catalog/public/catalog-reader.port.js';
import {
  CART_READER,
  type CartReader,
} from '../../../cart/public/cart-access.port.js';
import {
  INVENTORY_PORT,
  type InventoryPort,
} from '../../../inventory/public/inventory.port.js';
import {
  PROMOTIONS_PORT,
  type PromotionsPort,
} from '../../../promotions/public/promotions.port.js';
import type { DeliveryMethodCode } from '../../domain/delivery-method.js';
import { deliveryFeeOf } from '../../domain/delivery-method.js';
import { EmptyCartError } from '../../domain/errors/empty-cart.error.js';
import { ProductUnavailableError } from '../../domain/errors/product-unavailable.error.js';
import type { QuoteLineView, QuoteView } from '../results/quote-view.js';

export interface QuoteCheckoutCommand {
  customerId: string;
  deliveryMethod: DeliveryMethodCode;
  promoCode?: string;
}

@Injectable()
export class QuoteCheckoutUseCase {
  constructor(
    @Inject(CART_READER) private readonly cartReader: CartReader,
    @Inject(CATALOG_READER) private readonly catalog: CatalogReader,
    @Inject(INVENTORY_PORT) private readonly inventory: InventoryPort,
    @Inject(PROMOTIONS_PORT) private readonly promotions: PromotionsPort,
  ) {}

  async execute(command: QuoteCheckoutCommand): Promise<QuoteView> {
    const lines = await this.cartReader.getItems(command.customerId);
    if (lines.length === 0) {
      throw new EmptyCartError();
    }

    const items: QuoteLineView[] = [];
    let subtotalMinor = 0;
    for (const line of lines) {
      const product = await this.catalog.getActiveProduct(line.productId);
      if (!product) {
        throw new ProductUnavailableError();
      }
      const availableQuantity = await this.inventory.getAvailable(
        line.productId,
      );
      const lineTotalMinor = product.priceMinor * line.quantity;
      subtotalMinor += lineTotalMinor;
      items.push({
        productId: product.id,
        name: product.name,
        unitPriceMinor: product.priceMinor,
        quantity: line.quantity,
        availableQuantity,
        lineTotalMinor,
      });
    }

    let discountMinor = 0;
    if (command.promoCode) {
      const evaluation = await this.promotions.evaluate(
        command.promoCode,
        subtotalMinor,
      );
      discountMinor = evaluation.discountMinor;
    }

    const deliveryFeeMinor = deliveryFeeOf(command.deliveryMethod);
    return {
      items,
      subtotalMinor,
      discountMinor,
      deliveryMethod: command.deliveryMethod,
      deliveryFeeMinor,
      totalMinor: subtotalMinor - discountMinor + deliveryFeeMinor,
    };
  }
}
