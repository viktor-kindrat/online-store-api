import { Inject, Injectable } from '@nestjs/common';
import { ORDERS_PORT, type OrdersPort } from '../../../orders/public/index.js';
import { Payment } from '../../domain/entities/payment.js';
import { OrderNotPayableError } from '../../domain/errors/order-not-payable.error.js';
import { PaymentTargetNotFoundError } from '../../domain/errors/payment-target-not-found.error.js';
import {
  PAYMENT_PROVIDER_FACTORY,
  type PaymentProviderFactory,
} from '../ports/payment-provider.port.js';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepository,
} from '../ports/payment.repository.port.js';
import type { PaymentInitiatedView } from '../results/payment-views.js';

export interface InitiatePaymentCommand {
  orderId: string;
  customerId: string;
  providerName: string;
}

@Injectable()
export class InitiatePaymentUseCase {
  constructor(
    @Inject(ORDERS_PORT) private readonly orders: OrdersPort,
    @Inject(PAYMENT_REPOSITORY) private readonly payments: PaymentRepository,
    @Inject(PAYMENT_PROVIDER_FACTORY)
    private readonly providerFactory: PaymentProviderFactory,
  ) {}

  async execute(command: InitiatePaymentCommand): Promise<PaymentInitiatedView> {
    const order = await this.orders.getForPayment(command.orderId);
    if (!order || order.customerId !== command.customerId) {
      throw new PaymentTargetNotFoundError();
    }
    if (order.status !== 'PENDING_PAYMENT') {
      throw new OrderNotPayableError();
    }
    const provider = this.providerFactory.create(command.providerName);
    const payment =
      (await this.payments.findByOrderId(command.orderId)) ??
      Payment.create(command.orderId, order.amountMinor, provider.name);
    const session = await provider.createPayment({
      orderId: command.orderId,
      amountMinor: order.amountMinor,
    });
    const attempt = payment.addAttempt(session.providerReference);
    await this.payments.save(payment);
    const view: PaymentInitiatedView = {
      paymentId: payment.id,
      providerReference: attempt.providerReference,
      redirectUrl: session.redirectUrl,
    };
    if (session.method) {
      view.method = session.method;
    }
    if (session.formFields) {
      view.formFields = session.formFields;
    }
    return view;
  }
}
