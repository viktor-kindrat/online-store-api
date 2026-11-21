import { Promotion } from '../../domain/entities/promotion.js';
import { PromotionOrmEntity } from './promotion.orm-entity.js';

export function toPromotionDomain(row: PromotionOrmEntity): Promotion {
  return new Promotion(
    row.id,
    row.code,
    row.discountType,
    row.value,
    row.minOrderMinor,
    row.expiresAt,
    row.usageLimit,
  );
}

export function toPromotionOrm(promotion: Promotion): PromotionOrmEntity {
  const row = new PromotionOrmEntity();
  row.id = promotion.id;
  row.code = promotion.code;
  row.discountType = promotion.discountType;
  row.value = promotion.value;
  row.minOrderMinor = promotion.minOrderMinor;
  row.expiresAt = promotion.expiresAt;
  row.usageLimit = promotion.usageLimit;
  return row;
}
