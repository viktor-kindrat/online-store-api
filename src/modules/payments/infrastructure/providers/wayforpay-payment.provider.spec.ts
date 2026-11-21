import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  WayForPayPaymentProvider,
  type WayForPayConfig,
} from './wayforpay-payment.provider.js';

const config: WayForPayConfig = {
  merchantAccount: 'test_merch_n1',
  secretKey: 'flk3409refn54t54t*FNJRET',
  merchantDomainName: 'www.example.com',
  serviceUrl: 'https://api.example.com/api/v1/webhooks/payments/wayforpay',
  returnUrl: 'https://shop.example.com/orders',
};

function md5(secret: string, parts: ReadonlyArray<string | number>): string {
  return createHmac('md5', secret).update(parts.join(';')).digest('hex');
}

describe('WayForPayPaymentProvider', () => {
  it('signs the purchase form with the documented field order', async () => {
    const provider = new WayForPayPaymentProvider(config);

    const session = await provider.createPayment({
      orderId: 'order-1',
      amountMinor: 154736,
    });

    const fields = session.formFields ?? {};
    expect(session.method).toBe('POST');
    expect(session.redirectUrl).toBe('https://secure.wayforpay.com/pay');
    expect(fields.amount).toBe(1547.36);
    expect(fields.currency).toBe('UAH');

    const expected = md5(config.secretKey, [
      config.merchantAccount,
      config.merchantDomainName,
      String(fields.orderReference),
      Number(fields.orderDate),
      1547.36,
      'UAH',
      'Order order-1',
      1,
      1547.36,
    ]);
    expect(fields.merchantSignature).toBe(expected);
    expect(session.providerReference).toBe(fields.orderReference);
  });

  it('accepts a correctly signed webhook and reports the outcome', () => {
    const provider = new WayForPayPaymentProvider(config);
    const base = {
      merchantAccount: config.merchantAccount,
      orderReference: 'order-1-abc',
      amount: '1547.36',
      currency: 'UAH',
      authCode: '123456',
      cardPan: '44****1111',
      transactionStatus: 'Approved',
      reasonCode: '1100',
    };
    const merchantSignature = md5(config.secretKey, [
      base.merchantAccount,
      base.orderReference,
      base.amount,
      base.currency,
      base.authCode,
      base.cardPan,
      base.transactionStatus,
      base.reasonCode,
    ]);

    const event = provider.verifyWebhook({ ...base, merchantSignature });

    expect(event.outcome).toBe('SUCCEEDED');
    expect(event.providerReference).toBe('order-1-abc');
  });

  it('marks a declined transaction as FAILED when the signature is valid', () => {
    const provider = new WayForPayPaymentProvider(config);
    const base = {
      merchantAccount: config.merchantAccount,
      orderReference: 'order-2',
      amount: '500.00',
      currency: 'UAH',
      authCode: '',
      cardPan: '44****1111',
      transactionStatus: 'Declined',
      reasonCode: '1101',
    };
    const merchantSignature = md5(config.secretKey, [
      base.merchantAccount,
      base.orderReference,
      base.amount,
      base.currency,
      base.authCode,
      base.cardPan,
      base.transactionStatus,
      base.reasonCode,
    ]);

    const event = provider.verifyWebhook({ ...base, merchantSignature });

    expect(event.outcome).toBe('FAILED');
    expect(event.providerReference).toBe('order-2');
  });

  it('rejects a webhook whose signature does not match', () => {
    const provider = new WayForPayPaymentProvider(config);

    const event = provider.verifyWebhook({
      merchantAccount: config.merchantAccount,
      orderReference: 'order-1-abc',
      amount: '1547.36',
      currency: 'UAH',
      authCode: '123456',
      cardPan: '44****1111',
      transactionStatus: 'Approved',
      reasonCode: '1100',
      merchantSignature: 'tampered',
    });

    expect(event.providerReference).toBe('');
  });

  it('builds the accept acknowledgement with a matching signature', () => {
    const provider = new WayForPayPaymentProvider(config);

    const ack = provider.acknowledgeWebhook('order-1-abc');

    expect(ack.status).toBe('accept');
    expect(ack.orderReference).toBe('order-1-abc');
    expect(ack.signature).toBe(
      md5(config.secretKey, [ack.orderReference, ack.status, ack.time]),
    );
  });
});
