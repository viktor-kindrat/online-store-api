import { Inject, Injectable } from '@nestjs/common';
import { PromotionNotFoundError } from '../../domain/errors/promotion-not-found.error.js';
import {
  PROMOTION_REPOSITORY,
  type PromotionRepository,
} from '../ports/promotion.repository.port.js';
import { toPromotionView, type PromotionView } from '../results/promotion-view.js';

export interface UpdatePromotionCommand {
  value?: number;
  minOrderMinor?: number;
  expiresAt?: string;
  usageLimit?: number;
}

@Injectable()
export class UpdatePromotionUseCase {
  constructor(
    @Inject(PROMOTION_REPOSITORY)
    private readonly promotions: PromotionRepository,
  ) {}

  async execute(
    id: string,
    command: UpdatePromotionCommand,
  ): Promise<PromotionView> {
    const promotion = await this.promotions.findById(id);
    if (!promotion) {
      throw new PromotionNotFoundError();
    }
    if (command.value !== undefined) {
      promotion.value = command.value;
    }
    if (command.minOrderMinor !== undefined) {
      promotion.minOrderMinor = command.minOrderMinor;
    }
    if (command.expiresAt !== undefined) {
      promotion.expiresAt = new Date(command.expiresAt);
    }
    if (command.usageLimit !== undefined) {
      promotion.usageLimit = command.usageLimit;
    }
    await this.promotions.save(promotion);
    return toPromotionView(promotion);
  }
}
