import type { TransactionContext } from '../../../shared/application/transaction.js';

export const PROMOTIONS_PORT = 'PROMOTIONS_PORT';

export interface PromotionEvaluation {
  promotionId: string;
  discountMinor: number;
}

export interface PromotionsPort {
  evaluate(code: string, subtotalMinor: number): Promise<PromotionEvaluation>;
  recordRedemption(
    promotionId: string,
    orderId: string,
    tx: TransactionContext,
  ): Promise<void>;
}
