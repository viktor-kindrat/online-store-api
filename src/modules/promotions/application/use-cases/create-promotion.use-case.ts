import { Inject, Injectable } from '@nestjs/common';
import type { DiscountType } from '../../domain/discount-type.js';
import { Promotion } from '../../domain/entities/promotion.js';
import { PromotionCodeTakenError } from '../../domain/errors/promotion-code-taken.error.js';
import {
  PROMOTION_REPOSITORY,
  type PromotionRepository,
} from '../ports/promotion.repository.port.js';
import { toPromotionView, type PromotionView } from '../results/promotion-view.js';

export interface CreatePromotionCommand {
  code: string;
  discountType: DiscountType;
  value: number;
  minOrderMinor: number;
  expiresAt: string;
  usageLimit: number;
}

@Injectable()
export class CreatePromotionUseCase {
  constructor(
    @Inject(PROMOTION_REPOSITORY)
    private readonly promotions: PromotionRepository,
  ) {}

  async execute(command: CreatePromotionCommand): Promise<PromotionView> {
    const code = command.code.toUpperCase();
    const existing = await this.promotions.findByCode(code);
    if (existing) {
      throw new PromotionCodeTakenError();
    }
    const promotion = Promotion.create({
      code,
      discountType: command.discountType,
      value: command.value,
      minOrderMinor: command.minOrderMinor,
      expiresAt: new Date(command.expiresAt),
      usageLimit: command.usageLimit,
    });
    await this.promotions.save(promotion);
    return toPromotionView(promotion);
  }
}
