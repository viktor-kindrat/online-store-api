import { Inject, Injectable } from '@nestjs/common';
import type { TransactionContext } from '../../../../shared/application/transaction.js';
import { OrderNotFoundError } from '../../domain/errors/order-not-found.error.js';
import type {
  OrderPaymentView,
  OrdersPort,
} from '../../public/orders.port.js';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../ports/order.repository.port.js';

@Injectable()
export class OrdersPaymentFacade implements OrdersPort {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async getForPayment(orderId: string): Promise<OrderPaymentView | null> {
    const order = await this.orders.findById(orderId);
    return order
      ? {
          id: order.id,
          customerId: order.customerId,
          amountMinor: order.totalMinor,
          status: order.status,
        }
      : null;
  }

  async markPaid(orderId: string, tx: TransactionContext): Promise<void> {
    const order = await this.orders.findByIdWithin(orderId, tx);
    if (!order) {
      throw new OrderNotFoundError();
    }
    if (order.status === 'PAID') {
      return;
    }
    order.markPaid();
    await this.orders.setStatus(order.id, order.status, tx);
  }
}
