import { describe, expect, it } from 'vitest';
import { InvalidOrderTransitionError } from '../errors/invalid-order-transition.error.js';
import { Order } from './order.js';
import { OrderItem } from './order-item.js';

function makeOrder(): Order {
  return Order.create({
    customerId: 'customer-1',
    items: [new OrderItem('item-1', 'product-1', 'Product', 10000, 1)],
    subtotalMinor: 10000,
    discountMinor: 0,
    deliveryMethod: 'PICKUP',
    deliveryFeeMinor: 0,
    shippingAddress: { city: 'Lviv', street: 'Main', postalCode: '79000' },
    promotionId: null,
  });
}

describe('Order', () => {
  it('starts PENDING_PAYMENT with a computed total', () => {
    const order = makeOrder();
    expect(order.status).toBe('PENDING_PAYMENT');
    expect(order.totalMinor).toBe(10000);
  });

  it('allows PENDING_PAYMENT to PAID', () => {
    const order = makeOrder();
    order.markPaid();
    expect(order.status).toBe('PAID');
  });

  it('rejects paying an order twice', () => {
    const order = makeOrder();
    order.markPaid();
    expect(() => order.markPaid()).toThrow(InvalidOrderTransitionError);
  });

  it('rejects cancelling a paid order', () => {
    const order = makeOrder();
    order.markPaid();
    expect(() => order.cancel()).toThrow(InvalidOrderTransitionError);
  });
});
