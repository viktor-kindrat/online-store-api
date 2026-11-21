import type { PaymentProvider } from '../../application/ports/payment-provider.port.js';
import { MockPaymentProvider } from './mock-payment.provider.js';
import { PaymentProviderCreator } from './payment-provider.creator.js';

export class MockPaymentProviderCreator extends PaymentProviderCreator {
  createProvider(): PaymentProvider {
    return new MockPaymentProvider();
  }
}
