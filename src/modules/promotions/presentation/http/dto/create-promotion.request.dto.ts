import {
  IsIn,
  IsInt,
  IsISO8601,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  DISCOUNT_TYPES,
  type DiscountType,
} from '../../../domain/discount-type.js';

export class CreatePromotionRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code!: string;

  @IsIn([...DISCOUNT_TYPES])
  discountType!: DiscountType;

  @IsInt()
  @Min(0)
  value!: number;

  @IsInt()
  @Min(0)
  minOrderMinor!: number;

  @IsISO8601()
  expiresAt!: string;

  @IsInt()
  @Min(1)
  usageLimit!: number;
}
