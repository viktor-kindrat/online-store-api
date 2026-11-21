import { Inject, Injectable } from '@nestjs/common';
import {
  CATALOG_READER,
  type CatalogReader,
} from '../../../catalog/public/catalog-reader.port.js';
import { ProductUnavailableError } from '../../domain/errors/product-unavailable.error.js';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../ports/cart.repository.port.js';
import type { CartView } from '../results/cart-view.js';
import { CartViewBuilder } from '../services/cart-view.builder.js';

export interface AddCartItemCommand {
  customerId: string;
  productId: string;
  quantity: number;
}

@Injectable()
export class AddCartItemUseCase {
  constructor(
    @Inject(CART_REPOSITORY) private readonly carts: CartRepository,
    @Inject(CATALOG_READER) private readonly catalog: CatalogReader,
    private readonly viewBuilder: CartViewBuilder,
  ) {}

  async execute(command: AddCartItemCommand): Promise<CartView> {
    const product = await this.catalog.getActiveProduct(command.productId);
    if (!product) {
      throw new ProductUnavailableError();
    }
    const cart = await this.carts.getOrCreate(command.customerId);
    cart.addItem(command.productId, command.quantity);
    await this.carts.save(cart);
    return this.viewBuilder.build(cart);
  }
}
