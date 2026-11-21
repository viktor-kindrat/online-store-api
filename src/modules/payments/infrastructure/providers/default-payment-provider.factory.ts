import { Injectable } from '@nestjs/common';
import type {
  PaymentProvider,
  PaymentProviderFactory,
} from '../../application/ports/payment-provider.port.js';
import { MockPaymentProviderCreator } from './mock-payment-provider.creator.js';
import { PaymentProviderCreator } from './payment-provider.creator.js';

@Injectable()
export class DefaultPaymentProviderFactory implements PaymentProviderFactory {
  private readonly fallbackCreator: PaymentProviderCreator =
    new MockPaymentProviderCreator();

  private readonly creators: Record<string, PaymentProviderCreator> = {
    mock: this.fallbackCreator,
    sandbox: this.fallbackCreator,
  };

  create(providerName: string): PaymentProvider {
    const creator = this.creators[providerName] ?? this.fallbackCreator;
    return creator.createProvider();
  }
}
