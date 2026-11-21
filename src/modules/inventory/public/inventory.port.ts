import type { TransactionContext } from '../../../shared/application/transaction.js';
import type { StockBalanceView } from '../application/results/inventory-views.js';

export { StockBalanceView } from '../application/results/inventory-views.js';

export const INVENTORY_PORT = 'INVENTORY_PORT';

export interface ReservationItem {
  productId: string;
  quantity: number;
}

export interface InventoryPort {
  reserveItems(
    orderId: string,
    items: readonly ReservationItem[],
    tx: TransactionContext,
  ): Promise<void>;
  commitReservation(orderId: string, tx: TransactionContext): Promise<void>;
  releaseReservation(orderId: string, tx: TransactionContext): Promise<void>;
  getAvailable(productId: string): Promise<number>;
  setOnHand(productId: string, onHand: number): Promise<void>;
  listBalances(): Promise<StockBalanceView[]>;
  findExpiredReservationOrderIds(before: Date): Promise<string[]>;
}
