import { Inject, Injectable } from '@nestjs/common';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../ports/cart.repository.port.js';
import type { CartView } from '../results/cart-view.js';
import { CartViewBuilder } from '../services/cart-view.builder.js';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY) private readonly carts: CartRepository,
    private readonly viewBuilder: CartViewBuilder,
  ) {}

  async execute(customerId: string): Promise<CartView> {
    const cart = await this.carts.getOrCreate(customerId);
    return this.viewBuilder.build(cart);
  }
}
