import type { Payment } from '../../domain/entities/payment.js';
import type { PaymentStatus } from '../../domain/payment-status.js';
import type { PaymentFormFields } from '../ports/payment-provider.port.js';

export class PaymentInitiatedView {
  paymentId: string;
  providerReference: string;
  redirectUrl: string;
  method?: 'GET' | 'POST';
  formFields?: PaymentFormFields;
}

export class PaymentAttemptView {
  providerReference: string;
  status: PaymentStatus;
}

export class PaymentView {
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
