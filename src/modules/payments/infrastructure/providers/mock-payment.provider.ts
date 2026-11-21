import { randomUUID } from 'node:crypto';
import type {
  CreatePaymentRequest,
  PaymentEvent,
  PaymentProvider,
  PaymentSession,
} from '../../application/ports/payment-provider.port.js';

export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock';

  createPayment(request: CreatePaymentRequest): Promise<PaymentSession> {
    const providerReference = randomUUID();
    return Promise.resolve({
      providerReference,
      redirectUrl: `/mock-payments/${request.orderId}/${providerReference}`,
    });
  }

  verifyWebhook(payload: unknown): PaymentEvent {
    const body = (payload ?? {}) as {
      providerReference?: unknown;
      outcome?: unknown;
    };
    const providerReference =
      typeof body.providerReference === 'string' ? body.providerReference : '';
    const outcome = body.outcome === 'FAILED' ? 'FAILED' : 'SUCCEEDED';
    return { providerReference, outcome };
  }
}
