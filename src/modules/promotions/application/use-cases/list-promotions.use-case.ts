import { Inject, Injectable } from '@nestjs/common';
import {
  PROMOTION_REPOSITORY,
  type PromotionRepository,
} from '../ports/promotion.repository.port.js';
import { toPromotionView, type PromotionView } from '../results/promotion-view.js';

@Injectable()
export class ListPromotionsUseCase {
  constructor(
    @Inject(PROMOTION_REPOSITORY)
    private readonly promotions: PromotionRepository,
  ) {}

  async execute(): Promise<PromotionView[]> {
    const promotions = await this.promotions.listAll();
    return promotions.map(toPromotionView);
  }
}
