import type { Promotion } from '../../domain/entities/promotion.js';
import type { DiscountType } from '../../domain/discount-type.js';

export interface PromotionView {
  id: string;
  code: string;
  discountType: DiscountType;
  value: number;
  minOrderMinor: number;
  expiresAt: string;
  usageLimit: number;
}

export function toPromotionView(promotion: Promotion): PromotionView {
  return {
    id: promotion.id,
    code: promotion.code,
    discountType: promotion.discountType,
    value: promotion.value,
    minOrderMinor: promotion.minOrderMinor,
    expiresAt: promotion.expiresAt.toISOString(),
    usageLimit: promotion.usageLimit,
  };
}
