import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from '../inventory/inventory.module.js';
import { OrdersModule } from '../orders/orders.module.js';
import {
  ORDER_PAID_OBSERVERS,
  type OrderPaidObserver,
} from './application/events/order-paid.event.js';
import { NotificationObserver } from './application/events/notification.observer.js';
import { OrderPaidPublisher } from './application/events/order-paid.publisher.js';
import { SalesAuditObserver } from './application/events/sales-audit.observer.js';
import { PAYMENT_PROVIDER_FACTORY } from './application/ports/payment-provider.port.js';
import { PAYMENT_REPOSITORY } from './application/ports/payment.repository.port.js';
import { HandlePaymentWebhookUseCase } from './application/use-cases/handle-payment-webhook.use-case.js';
import { InitiatePaymentUseCase } from './application/use-cases/initiate-payment.use-case.js';
import { ListOrderPaymentsUseCase } from './application/use-cases/list-order-payments.use-case.js';
import { PaymentAttemptOrmEntity } from './infrastructure/persistence/payment-attempt.orm-entity.js';
import { PaymentOrmEntity } from './infrastructure/persistence/payment.orm-entity.js';
import { TypeOrmPaymentRepository } from './infrastructure/persistence/typeorm-payment.repository.js';
import { DefaultPaymentProviderFactory } from './infrastructure/providers/default-payment-provider.factory.js';
import { PaymentsController } from './presentation/http/payments.controller.js';
import { PaymentWebhookController } from './presentation/http/webhook.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentOrmEntity, PaymentAttemptOrmEntity]),
    OrdersModule,
    InventoryModule,
  ],
  controllers: [PaymentsController, PaymentWebhookController],
  providers: [
    InitiatePaymentUseCase,
    HandlePaymentWebhookUseCase,
    ListOrderPaymentsUseCase,
    OrderPaidPublisher,
    NotificationObserver,
    SalesAuditObserver,
    {
      provide: ORDER_PAID_OBSERVERS,
      useFactory: (
        notification: NotificationObserver,
        audit: SalesAuditObserver,
      ): OrderPaidObserver[] => [notification, audit],
      inject: [NotificationObserver, SalesAuditObserver],
    },
    { provide: PAYMENT_REPOSITORY, useClass: TypeOrmPaymentRepository },
    { provide: PAYMENT_PROVIDER_FACTORY, useClass: DefaultPaymentProviderFactory },
  ],
})
export class PaymentsModule {}
