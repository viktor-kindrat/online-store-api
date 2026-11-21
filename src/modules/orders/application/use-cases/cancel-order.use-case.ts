import { Inject, Injectable } from '@nestjs/common';
import {
  INVENTORY_PORT,
  type InventoryPort,
} from '../../../inventory/public/inventory.port.js';
import {
  TRANSACTION_MANAGER,
  type TransactionManager,
} from '../../../../shared/application/transaction.js';
import { OrderNotFoundError } from '../../domain/errors/order-not-found.error.js';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../ports/order.repository.port.js';
import { toOrderView, type OrderView } from '../results/order-view.js';

export interface CancelOrderCommand {
  customerId: string;
  orderId: string;
}

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
    @Inject(INVENTORY_PORT) private readonly inventory: InventoryPort,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactions: TransactionManager,
  ) {}

  async execute(command: CancelOrderCommand): Promise<OrderView> {
    const order = await this.orders.findById(command.orderId);
    if (!order || order.customerId !== command.customerId) {
      throw new OrderNotFoundError();
    }
    order.cancel();
    await this.transactions.run(async (tx) => {
      await this.inventory.releaseReservation(order.id, tx);
      await this.orders.setStatus(order.id, order.status, tx);
    });
    return toOrderView(order);
  }
}
