import { createHmac, randomUUID } from 'node:crypto';
import type {
  CreatePaymentRequest,
  PaymentEvent,
  PaymentFormFields,
  PaymentProvider,
  PaymentSession,
} from '../../application/ports/payment-provider.port.js';

export interface WayForPayConfig {
  merchantAccount: string;
  secretKey: string;
  merchantDomainName: string;
  serviceUrl: string;
  returnUrl: string;
}

interface WayForPayWebhookPayload {
  merchantAccount: string;
  orderReference: string;
  amount: string;
  currency: string;
  authCode: string;
  cardPan: string;
  transactionStatus: string;
  reasonCode: string;
  merchantSignature: string;
}

const WAYFORPAY_ENDPOINT = 'https://secure.wayforpay.com/pay';
const CURRENCY = 'UAH';

function asString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return '';
}

export class WayForPayPaymentProvider implements PaymentProvider {
  readonly name = 'wayforpay';

  constructor(private readonly config: WayForPayConfig) {}

  createPayment(request: CreatePaymentRequest): Promise<PaymentSession> {
    const orderReference = `${request.orderId}-${randomUUID()}`;
    const orderDate = Math.floor(Date.now() / 1000);
    const amount = Number((request.amountMinor / 100).toFixed(2));
    const productName = [`Order ${request.orderId}`];
    const productCount = [1];
    const productPrice = [amount];
    const merchantSignature = this.sign([
      this.config.merchantAccount,
      this.config.merchantDomainName,
      orderReference,
      orderDate,
      amount,
      CURRENCY,
      productName[0] ?? '',
      productCount[0] ?? 0,
      productPrice[0] ?? 0,
    ]);
    const formFields: PaymentFormFields = {
      merchantAccount: this.config.merchantAccount,
      merchantDomainName: this.config.merchantDomainName,
      merchantSignature,
      orderReference,
      orderDate,
      amount,
      currency: CURRENCY,
      productName,
      productCount,
      productPrice,
      serviceUrl: this.config.serviceUrl,
      returnUrl: this.config.returnUrl,
    };
    return Promise.resolve({
      providerReference: orderReference,
      redirectUrl: WAYFORPAY_ENDPOINT,
      method: 'POST',
      formFields,
    });
  }

  verifyWebhook(payload: unknown): PaymentEvent {
    const body = this.parse(payload);
    const expected = this.sign([
      body.merchantAccount,
      body.orderReference,
      body.amount,
      body.currency,
      body.authCode,
      body.cardPan,
      body.transactionStatus,
      body.reasonCode,
    ]);
    if (expected !== body.merchantSignature) {
      return { providerReference: '', outcome: 'FAILED' };
    }
    return {
      providerReference: body.orderReference,
      outcome: body.transactionStatus === 'Approved' ? 'SUCCEEDED' : 'FAILED',
    };
  }

  acknowledgeWebhook(providerReference: string): {
    orderReference: string;
    status: string;
    time: number;
    signature: string;
  } {
    const status = 'accept';
    const time = Math.floor(Date.now() / 1000);
    const signature = this.sign([providerReference, status, time]);
    return { orderReference: providerReference, status, time, signature };
  }

  private parse(payload: unknown): WayForPayWebhookPayload {
    const source =
      typeof payload === 'object' && payload !== null
        ? (payload as Record<string, unknown>)
        : {};
    return {
      merchantAccount: asString(source.merchantAccount),
      orderReference: asString(source.orderReference),
      amount: asString(source.amount),
      currency: asString(source.currency),
      authCode: asString(source.authCode),
      cardPan: asString(source.cardPan),
      transactionStatus: asString(source.transactionStatus),
      reasonCode: asString(source.reasonCode),
      merchantSignature: asString(source.merchantSignature),
    };
  }

  private sign(parts: ReadonlyArray<string | number>): string {
    return createHmac('md5', this.config.secretKey)
      .update(parts.join(';'))
      .digest('hex');
  }
}
