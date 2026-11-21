import { Inject, Injectable } from '@nestjs/common';
import { ORDERS_PORT, type OrdersPort } from '../../../orders/public/index.js';
import { PaymentTargetNotFoundError } from '../../domain/errors/payment-target-not-found.error.js';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepository,
} from '../ports/payment.repository.port.js';
import { toPaymentView, type PaymentView } from '../results/payment-views.js';

export interface ListOrderPaymentsQuery {
  orderId: string;
  customerId: string;
}

@Injectable()
export class ListOrderPaymentsUseCase {
  constructor(
    @Inject(ORDERS_PORT) private readonly orders: OrdersPort,
    @Inject(PAYMENT_REPOSITORY) private readonly payments: PaymentRepository,
  ) {}

  async execute(query: ListOrderPaymentsQuery): Promise<PaymentView[]> {
    const order = await this.orders.getForPayment(query.orderId);
    if (!order || order.customerId !== query.customerId) {
      throw new PaymentTargetNotFoundError();
    }
    const payment = await this.payments.findByOrderId(query.orderId);
    return payment ? [toPaymentView(payment)] : [];
  }
}
