import { Payment } from '../../domain/entities/payment.js';
import { PaymentAttempt } from '../../domain/entities/payment-attempt.js';
import { PaymentAttemptOrmEntity } from './payment-attempt.orm-entity.js';
import { PaymentOrmEntity } from './payment.orm-entity.js';

export function toPaymentDomain(
  row: PaymentOrmEntity,
  attemptRows: PaymentAttemptOrmEntity[],
): Payment {
  const attempts = attemptRows.map(
    (attempt) =>
      new PaymentAttempt(attempt.id, attempt.providerReference, attempt.status),
  );
  return new Payment(
    row.id,
    row.orderId,
    row.amountMinor,
    row.provider,
    row.status,
    attempts,
  );
}

export function toPaymentOrm(payment: Payment): PaymentOrmEntity {
  const row = new PaymentOrmEntity();
  row.id = payment.id;
  row.orderId = payment.orderId;
  row.amountMinor = payment.amountMinor;
  row.provider = payment.provider;
  row.status = payment.status;
  return row;
}

export function toPaymentAttemptOrm(
  paymentId: string,
  attempt: PaymentAttempt,
): PaymentAttemptOrmEntity {
  const row = new PaymentAttemptOrmEntity();
  row.id = attempt.id;
  row.paymentId = paymentId;
  row.providerReference = attempt.providerReference;
  row.status = attempt.status;
  return row;
}
