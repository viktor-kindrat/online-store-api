import { Inject, Injectable } from '@nestjs/common';
import { CartItemNotFoundError } from '../../domain/errors/cart-item-not-found.error.js';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../ports/cart.repository.port.js';
import type { CartView } from '../results/cart-view.js';
import { CartViewBuilder } from '../services/cart-view.builder.js';

export interface ChangeCartItemQuantityCommand {
  customerId: string;
  itemId: string;
  quantity: number;
}

@Injectable()
export class ChangeCartItemQuantityUseCase {
  constructor(
    @Inject(CART_REPOSITORY) private readonly carts: CartRepository,
    private readonly viewBuilder: CartViewBuilder,
  ) {}

  async execute(command: ChangeCartItemQuantityCommand): Promise<CartView> {
    const cart = await this.carts.findByCustomerId(command.customerId);
    if (!cart) {
      throw new CartItemNotFoundError();
    }
    cart.changeItemQuantity(command.itemId, command.quantity);
    await this.carts.save(cart);
    return this.viewBuilder.build(cart);
  }
}
