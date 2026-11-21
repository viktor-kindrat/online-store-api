import type { TransactionContext } from '../../../../shared/application/transaction.js';
import type { Promotion } from '../../domain/entities/promotion.js';

export const PROMOTION_REPOSITORY = 'PROMOTION_REPOSITORY';

export interface PromotionRepository {
  findByCode(code: string): Promise<Promotion | null>;
  findById(id: string): Promise<Promotion | null>;
  save(promotion: Promotion): Promise<void>;
  countRedemptions(promotionId: string): Promise<number>;
  recordRedemption(
    promotionId: string,
    orderId: string,
    tx: TransactionContext,
  ): Promise<void>;
  listAll(): Promise<Promotion[]>;
}
