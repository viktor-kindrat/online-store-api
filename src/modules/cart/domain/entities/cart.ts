import { randomUUID } from 'node:crypto';
import { CART_LIMITS } from '../cart.constants.js';
import { CartItemNotFoundError } from '../errors/cart-item-not-found.error.js';
import { CartLimitExceededError } from '../errors/cart-limit-exceeded.error.js';
import { CartItem } from './cart-item.js';

export class Cart {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public items: CartItem[],
  ) {}

  static createEmpty(customerId: string): Cart {
    return new Cart(randomUUID(), customerId, []);
  }

  addItem(productId: string, quantity: number): void {
    const existing = this.items.find((item) => item.productId === productId);
    if (existing) {
      Cart.assertQuantity(existing.quantity + quantity);
      existing.increaseBy(quantity);
      return;
    }
    if (this.items.length >= CART_LIMITS.MAX_DISTINCT_ITEMS) {
      throw new CartLimitExceededError();
    }
    Cart.assertQuantity(quantity);
    this.items.push(CartItem.create(productId, quantity));
  }

  changeItemQuantity(itemId: string, quantity: number): void {
    const item = this.items.find((candidate) => candidate.id === itemId);
    if (!item) {
      throw new CartItemNotFoundError();
    }
    Cart.assertQuantity(quantity);
    item.setQuantity(quantity);
  }

  removeItem(itemId: string): void {
    const exists = this.items.some((item) => item.id === itemId);
    if (!exists) {
      throw new CartItemNotFoundError();
    }
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  private static assertQuantity(quantity: number): void {
    if (quantity < 1 || quantity > CART_LIMITS.MAX_ITEM_QUANTITY) {
      throw new CartLimitExceededError();
    }
  }
}
