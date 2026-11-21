import type { TransactionContext } from '../../../shared/application/transaction.js';

export const CART_READER = 'CART_READER';
export const CART_WRITER = 'CART_WRITER';

export interface CartLineItem {
  productId: string;
  quantity: number;
}

export interface CartReader {
  getItems(customerId: string): Promise<CartLineItem[]>;
}

export interface CartWriter {
  clear(customerId: string, tx: TransactionContext): Promise<void>;
}
