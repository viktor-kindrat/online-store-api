import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  PRODUCT_STATUSES,
  type ProductStatus,
} from '../../../domain/product-status.js';
import { CATALOG_LIMITS } from '../../../domain/catalog.constants.js';
import { ProductAttributeDto } from './product-attribute.dto.js';

export class UpdateProductRequestDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(CATALOG_LIMITS.MAX_DESCRIPTION_LENGTH)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(CATALOG_LIMITS.MAX_PRICE_MINOR)
  priceMinor?: number;

  @IsOptional()
  @IsIn([...PRODUCT_STATUSES])
  status?: ProductStatus;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(CATALOG_LIMITS.MAX_ATTRIBUTES)
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  attributes?: ProductAttributeDto[];
}
