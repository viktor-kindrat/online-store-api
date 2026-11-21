import {
  IsIn,
  IsInt,
  IsISO8601,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  DISCOUNT_TYPES,
  type DiscountType,
} from '../../../domain/discount-type.js';
import { PROMOTION_LIMITS } from '../../../domain/promotion.constants.js';

export class CreatePromotionRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code!: string;

  @IsIn([...DISCOUNT_TYPES])
  discountType!: DiscountType;

  @IsInt()
  @Min(0)
  @Max(PROMOTION_LIMITS.MAX_VALUE)
  value!: number;

  @IsInt()
  @Min(0)
  @Max(PROMOTION_LIMITS.MAX_MIN_ORDER_MINOR)
  minOrderMinor!: number;

  @IsISO8601()
  expiresAt!: string;

  @IsInt()
  @Min(1)
  @Max(PROMOTION_LIMITS.MAX_USAGE_LIMIT)
  usageLimit!: number;
}
