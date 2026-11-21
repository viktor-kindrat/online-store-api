import type { Payment } from '../../domain/entities/payment.js';
import type { PaymentStatus } from '../../domain/payment-status.js';

export interface PaymentInitiatedView {
  paymentId: string;
  providerReference: string;
  redirectUrl: string;
}

export interface PaymentAttemptView {
  providerReference: string;
  status: PaymentStatus;
}

export interface PaymentView {
  id: string;
  orderId: string;
  amountMinor: number;
  status: PaymentStatus;
  attempts: PaymentAttemptView[];
}

export function toPaymentView(payment: Payment): PaymentView {
  return {
    id: payment.id,
    orderId: payment.orderId,
    amountMinor: payment.amountMinor,
    status: payment.status,
    attempts: payment.attempts.map((attempt) => ({
      providerReference: attempt.providerReference,
      status: attempt.status,
    })),
  };
}
