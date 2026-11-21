import { describe, expect, it } from 'vitest';
import { CartItemNotFoundError } from '../errors/cart-item-not-found.error.js';
import { CartLimitExceededError } from '../errors/cart-limit-exceeded.error.js';
import { Cart } from './cart.js';

describe('Cart', () => {
  it('merges quantity when adding the same product', () => {
    const cart = Cart.createEmpty('customer-1');
    cart.addItem('product-1', 2);
    cart.addItem('product-1', 3);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]?.quantity).toBe(5);
  });

  it('rejects exceeding the max item quantity', () => {
    const cart = Cart.createEmpty('customer-1');
    expect(() => cart.addItem('product-1', 101)).toThrow(CartLimitExceededError);
  });

  it('removes an item', () => {
    const cart = Cart.createEmpty('customer-1');
    cart.addItem('product-1', 1);
    const itemId = cart.items[0]?.id ?? '';
    cart.removeItem(itemId);
    expect(cart.items).toHaveLength(0);
  });

  it('throws when removing a missing item', () => {
    const cart = Cart.createEmpty('customer-1');
    expect(() => cart.removeItem('missing')).toThrow(CartItemNotFoundError);
  });
});
