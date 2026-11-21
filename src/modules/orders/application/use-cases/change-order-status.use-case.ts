import { Inject, Injectable } from '@nestjs/common';
import {
  TRANSACTION_MANAGER,
  type TransactionManager,
} from '../../../../shared/application/transaction.js';
import { InvalidOrderTransitionError } from '../../domain/errors/invalid-order-transition.error.js';
import { OrderNotFoundError } from '../../domain/errors/order-not-found.error.js';
import type { OrderStatus } from '../../domain/order-status.js';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../ports/order.repository.port.js';
import { toOrderView, type OrderView } from '../results/order-view.js';

export interface ChangeOrderStatusCommand {
  orderId: string;
  status: OrderStatus;
}

@Injectable()
export class ChangeOrderStatusUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactions: TransactionManager,
  ) {}

  async execute(command: ChangeOrderStatusCommand): Promise<OrderView> {
    if (command.status === 'PAID') {
      throw new InvalidOrderTransitionError();
    }
    const order = await this.orders.findById(command.orderId);
    if (!order) {
      throw new OrderNotFoundError();
    }
    order.changeStatus(command.status);
    await this.transactions.run((tx) =>
      this.orders.setStatus(order.id, order.status, tx),
    );
    return toOrderView(order);
  }
}
