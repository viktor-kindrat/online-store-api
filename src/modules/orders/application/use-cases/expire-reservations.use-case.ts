import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  INVENTORY_PORT,
  type InventoryPort,
} from '../../../inventory/public/inventory.port.js';
import {
  TRANSACTION_MANAGER,
  type TransactionManager,
} from '../../../../shared/application/transaction.js';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../ports/order.repository.port.js';

@Injectable()
export class ExpireReservationsUseCase {
  private readonly logger = new Logger(ExpireReservationsUseCase.name);

  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
    @Inject(INVENTORY_PORT) private readonly inventory: InventoryPort,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactions: TransactionManager,
  ) {}

  async execute(): Promise<number> {
    const orderIds = await this.inventory.findExpiredReservationOrderIds(
      new Date(),
    );
    let cancelled = 0;
    for (const orderId of orderIds) {
      const order = await this.orders.findById(orderId);
      if (!order || order.status !== 'PENDING_PAYMENT') {
        continue;
      }
      order.cancel();
      await this.transactions.run(async (tx) => {
        await this.inventory.releaseReservation(orderId, tx);
        await this.orders.setStatus(orderId, order.status, tx);
      });
      cancelled += 1;
    }
    if (cancelled > 0) {
      this.logger.log(`Cancelled ${cancelled} expired unpaid order(s)`);
    }
    return cancelled;
  }
}
