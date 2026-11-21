import type { Cart } from '../../domain/entities/cart.js';

export const CART_REPOSITORY = 'CART_REPOSITORY';

export interface CartRepository {
  findByCustomerId(customerId: string): Promise<Cart | null>;
  getOrCreate(customerId: string): Promise<Cart>;
  save(cart: Cart): Promise<void>;
}
