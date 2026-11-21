import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  PRODUCT_STATUSES,
  type ProductStatus,
} from '../../../domain/product-status.js';

export class CreateProductRequestDto {
  @IsUUID()
  categoryId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @IsString()
  @MaxLength(5000)
  description!: string;

  @IsInt()
  @Min(0)
  priceMinor!: number;

  @IsOptional()
  @IsIn([...PRODUCT_STATUSES])
  status?: ProductStatus;
}
