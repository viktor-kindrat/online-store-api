import { Cart } from '../../domain/entities/cart.js';
import { CartItem } from '../../domain/entities/cart-item.js';
import { CartItemOrmEntity } from './cart-item.orm-entity.js';

export function toCartDomain(
  id: string,
  customerId: string,
  itemRows: CartItemOrmEntity[],
): Cart {
  const items = itemRows.map(
    (row) => new CartItem(row.id, row.productId, row.quantity),
  );
  return new Cart(id, customerId, items);
}

export function toCartItemOrm(cartId: string, item: CartItem): CartItemOrmEntity {
  const row = new CartItemOrmEntity();
  row.id = item.id;
  row.cartId = cartId;
  row.productId = item.productId;
  row.quantity = item.quantity;
  return row;
}
