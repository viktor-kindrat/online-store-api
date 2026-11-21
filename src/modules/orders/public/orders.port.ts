import type { TransactionContext } from '../../../shared/application/transaction.js';
import type { OrderStatus } from '../domain/order-status.js';

export const ORDERS_PORT = 'ORDERS_PORT';

export interface OrderPaymentView {
  id: string;
  customerId: string;
  amountMinor: number;
  status: OrderStatus;
}

export interface OrdersPort {
  getForPayment(orderId: string): Promise<OrderPaymentView | null>;
  markPaid(orderId: string, tx: TransactionContext): Promise<void>;
}
