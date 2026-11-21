import type { PaymentProvider } from '../../application/ports/payment-provider.port.js';

export abstract class PaymentProviderCreator {
  abstract createProvider(): PaymentProvider;
}
