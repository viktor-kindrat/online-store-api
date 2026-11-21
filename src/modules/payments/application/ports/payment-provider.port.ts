export const PAYMENT_PROVIDER_FACTORY = 'PAYMENT_PROVIDER_FACTORY';

export interface CreatePaymentRequest {
  orderId: string;
  amountMinor: number;
}

export interface PaymentSession {
  providerReference: string;
  redirectUrl: string;
}

export interface PaymentEvent {
  providerReference: string;
  outcome: 'SUCCEEDED' | 'FAILED';
}

export interface PaymentProvider {
  readonly name: string;
  createPayment(request: CreatePaymentRequest): Promise<PaymentSession>;
  verifyWebhook(payload: unknown): PaymentEvent;
}

export interface PaymentProviderFactory {
  create(providerName: string): PaymentProvider;
}
