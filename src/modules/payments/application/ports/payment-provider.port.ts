export const PAYMENT_PROVIDER_FACTORY = 'PAYMENT_PROVIDER_FACTORY';

export interface CreatePaymentRequest {
  orderId: string;
  amountMinor: number;
}

export type PaymentFormFields = Record<
  string,
  string | number | Array<string | number>
>;

export interface PaymentSession {
  providerReference: string;
  redirectUrl: string;
  method?: 'GET' | 'POST';
  formFields?: PaymentFormFields;
}

export interface PaymentEvent {
  providerReference: string;
  outcome: 'SUCCEEDED' | 'FAILED';
}

export interface PaymentProvider {
  readonly name: string;
  createPayment(request: CreatePaymentRequest): Promise<PaymentSession>;
  verifyWebhook(payload: unknown): PaymentEvent;
  acknowledgeWebhook?(providerReference: string): unknown;
}

export interface PaymentProviderFactory {
  create(providerName: string): PaymentProvider;
}
