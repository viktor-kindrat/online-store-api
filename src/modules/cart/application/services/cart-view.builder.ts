import { Inject, Injectable } from '@nestjs/common';
import {
  CATALOG_READER,
  type CatalogReader,
} from '../../../catalog/public/catalog-reader.port.js';
import type { Cart } from '../../domain/entities/cart.js';
import type { CartItemView, CartView } from '../results/cart-view.js';

@Injectable()
export class CartViewBuilder {
  constructor(
    @Inject(CATALOG_READER) private readonly catalog: CatalogReader,
  ) {}

  async build(cart: Cart): Promise<CartView> {
    const items: CartItemView[] = [];
    let subtotalMinor = 0;
    for (const item of cart.items) {
      const snapshot = await this.catalog.getActiveProduct(item.productId);
      const unitPriceMinor = snapshot?.priceMinor ?? 0;
      const name = snapshot?.name ?? 'Unavailable';
      const lineTotalMinor = unitPriceMinor * item.quantity;
      subtotalMinor += lineTotalMinor;
      items.push({
        id: item.id,
        productId: item.productId,
        name,
        unitPriceMinor,
        quantity: item.quantity,
        lineTotalMinor,
      });
    }
    return { id: cart.id, items, subtotalMinor };
  }
}
