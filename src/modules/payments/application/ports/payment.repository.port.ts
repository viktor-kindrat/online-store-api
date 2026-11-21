import type { TransactionContext } from '../../../../shared/application/transaction.js';
import type { Payment } from '../../domain/entities/payment.js';

export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

export interface PaymentRepository {
  findByOrderId(orderId: string): Promise<Payment | null>;
  findByProviderReference(reference: string): Promise<Payment | null>;
  save(payment: Payment): Promise<void>;
  saveWithin(payment: Payment, tx: TransactionContext): Promise<void>;
}
