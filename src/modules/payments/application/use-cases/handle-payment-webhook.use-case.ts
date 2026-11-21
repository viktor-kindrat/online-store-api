import { Inject, Injectable } from '@nestjs/common';
import {
  INVENTORY_PORT,
  type InventoryPort,
} from '../../../inventory/public/inventory.port.js';
import { ORDERS_PORT, type OrdersPort } from '../../../orders/public/index.js';
import {
  TRANSACTION_MANAGER,
  type TransactionManager,
} from '../../../../shared/application/transaction.js';
import { OrderPaidPublisher } from '../events/order-paid.publisher.js';
import {
  PAYMENT_PROVIDER_FACTORY,
  type PaymentProviderFactory,
} from '../ports/payment-provider.port.js';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepository,
} from '../ports/payment.repository.port.js';

export interface HandlePaymentWebhookCommand {
  providerName: string;
  payload: unknown;
}

@Injectable()
export class HandlePaymentWebhookUseCase {
  constructor(
    @Inject(PAYMENT_PROVIDER_FACTORY)
    private readonly providerFactory: PaymentProviderFactory,
    @Inject(PAYMENT_REPOSITORY) private readonly payments: PaymentRepository,
    @Inject(ORDERS_PORT) private readonly orders: OrdersPort,
    @Inject(INVENTORY_PORT) private readonly inventory: InventoryPort,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactions: TransactionManager,
    private readonly publisher: OrderPaidPublisher,
  ) {}

  async execute(command: HandlePaymentWebhookCommand): Promise<void> {
    const provider = this.providerFactory.create(command.providerName);
    const event = provider.verifyWebhook(command.payload);
    if (!event.providerReference) {
      return;
    }
    const payment = await this.payments.findByProviderReference(
      event.providerReference,
    );
    if (!payment || payment.isSettled()) {
      return;
    }
    if (event.outcome === 'FAILED') {
      payment.markFailed(event.providerReference);
      await this.payments.save(payment);
      return;
    }
    await this.transactions.run(async (tx) => {
      payment.markSucceeded(event.providerReference);
      await this.payments.saveWithin(payment, tx);
      await this.orders.markPaid(payment.orderId, tx);
      await this.inventory.commitReservation(payment.orderId, tx);
    });
    await this.publisher.publish({
      orderId: payment.orderId,
      amountMinor: payment.amountMinor,
    });
  }
}
