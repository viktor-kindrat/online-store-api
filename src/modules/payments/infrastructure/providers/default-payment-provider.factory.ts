import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../../../../infrastructure/config/env.schema.js';
import type {
  PaymentProvider,
  PaymentProviderFactory,
} from '../../application/ports/payment-provider.port.js';
import { MockPaymentProviderCreator } from './mock-payment-provider.creator.js';
import { PaymentProviderCreator } from './payment-provider.creator.js';
import { WayForPayProviderCreator } from './wayforpay-payment-provider.creator.js';

@Injectable()
export class DefaultPaymentProviderFactory implements PaymentProviderFactory {
  private readonly fallbackCreator: PaymentProviderCreator =
    new MockPaymentProviderCreator();

  private readonly creators: Record<string, PaymentProviderCreator>;

  constructor(private readonly config: ConfigService<Env, true>) {
    this.creators = {
      mock: this.fallbackCreator,
      sandbox: this.fallbackCreator,
      wayforpay: new WayForPayProviderCreator({
        merchantAccount:
          this.config.get('WAYFORPAY_MERCHANT_ACCOUNT', { infer: true }) ?? '',
        secretKey:
          this.config.get('WAYFORPAY_SECRET_KEY', { infer: true }) ?? '',
        merchantDomainName:
          this.config.get('WAYFORPAY_DOMAIN', { infer: true }) ?? '',
        serviceUrl: `${this.config.get('PUBLIC_API_URL', {
          infer: true,
        })}/api/v1/webhooks/payments/wayforpay`,
        returnUrl: `${this.config.get('WEB_PUBLIC_URL', { infer: true })}/orders`,
      }),
    };
  }

  create(providerName: string): PaymentProvider {
    const creator = this.creators[providerName] ?? this.fallbackCreator;
    return creator.createProvider();
  }
}
