import { IsInt, IsISO8601, IsOptional, Max, Min } from 'class-validator';
import { PROMOTION_LIMITS } from '../../../domain/promotion.constants.js';

export class UpdatePromotionRequestDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(PROMOTION_LIMITS.MAX_VALUE)
  value?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(PROMOTION_LIMITS.MAX_MIN_ORDER_MINOR)
  minOrderMinor?: number;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(PROMOTION_LIMITS.MAX_USAGE_LIMIT)
  usageLimit?: number;
}
