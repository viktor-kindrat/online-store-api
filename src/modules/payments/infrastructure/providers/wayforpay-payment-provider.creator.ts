import type { PaymentProvider } from '../../application/ports/payment-provider.port.js';
import { PaymentProviderCreator } from './payment-provider.creator.js';
import {
  WayForPayPaymentProvider,
  type WayForPayConfig,
} from './wayforpay-payment.provider.js';

export class WayForPayProviderCreator extends PaymentProviderCreator {
  constructor(private readonly config: WayForPayConfig) {
    super();
  }

  createProvider(): PaymentProvider {
    return new WayForPayPaymentProvider(this.config);
  }
}
