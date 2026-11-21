import type { TransactionContext } from '../../../../shared/application/transaction.js';
import type { Order } from '../../domain/entities/order.js';
import type { OrderStatus } from '../../domain/order-status.js';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

export interface OrderRepository {
  create(order: Order, tx: TransactionContext): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByIdWithin(id: string, tx: TransactionContext): Promise<Order | null>;
  findByCustomer(customerId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  setStatus(
    orderId: string,
    status: OrderStatus,
    tx: TransactionContext,
  ): Promise<void>;
}
