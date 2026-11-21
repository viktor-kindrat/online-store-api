import { randomUUID } from 'node:crypto';

export class PromotionRedemption {
  constructor(
    public readonly id: string,
    public readonly promotionId: string,
    public readonly orderId: string,
  ) {}

  static create(promotionId: string, orderId: string): PromotionRedemption {
    return new PromotionRedemption(randomUUID(), promotionId, orderId);
  }
}
