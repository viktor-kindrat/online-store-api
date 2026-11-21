import { Inject, Injectable } from '@nestjs/common';
import type { TransactionContext } from '../../../../shared/application/transaction.js';
import { DiscountCalculator } from '../../domain/strategies/discount-calculator.js';
import { PromotionExpiredError } from '../../domain/errors/promotion-expired.error.js';
import { PromotionMinimumNotMetError } from '../../domain/errors/promotion-minimum-not-met.error.js';
import { PromotionNotFoundError } from '../../domain/errors/promotion-not-found.error.js';
import { PromotionUsageExhaustedError } from '../../domain/errors/promotion-usage-exhausted.error.js';
import {
  PROMOTION_REPOSITORY,
  type PromotionRepository,
} from '../ports/promotion.repository.port.js';
import type {
  PromotionEvaluation,
  PromotionsPort,
} from '../../public/promotions.port.js';

@Injectable()
export class PromotionsFacade implements PromotionsPort {
  constructor(
    @Inject(PROMOTION_REPOSITORY)
    private readonly promotions: PromotionRepository,
    private readonly calculator: DiscountCalculator,
  ) {}

  async evaluate(
    code: string,
    subtotalMinor: number,
  ): Promise<PromotionEvaluation> {
    const promotion = await this.promotions.findByCode(code.toUpperCase());
    if (!promotion) {
      throw new PromotionNotFoundError();
    }
    if (promotion.isExpired(new Date())) {
      throw new PromotionExpiredError();
    }
    if (subtotalMinor < promotion.minOrderMinor) {
      throw new PromotionMinimumNotMetError();
    }
    const redemptions = await this.promotions.countRedemptions(promotion.id);
    if (redemptions >= promotion.usageLimit) {
      throw new PromotionUsageExhaustedError();
    }
    const discountMinor = this.calculator.calculate(
      promotion.discountType,
      promotion.value,
      subtotalMinor,
    );
    return { promotionId: promotion.id, discountMinor };
  }

  recordRedemption(
    promotionId: string,
    orderId: string,
    tx: TransactionContext,
  ): Promise<void> {
    return this.promotions.recordRedemption(promotionId, orderId, tx);
  }
}
