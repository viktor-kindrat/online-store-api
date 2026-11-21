import { randomUUID } from 'node:crypto';

export class CartItem {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public quantity: number,
  ) {}

  static create(productId: string, quantity: number): CartItem {
    return new CartItem(randomUUID(), productId, quantity);
  }

  increaseBy(quantity: number): void {
    this.quantity += quantity;
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }
}
