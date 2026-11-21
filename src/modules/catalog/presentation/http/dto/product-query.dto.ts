import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../../../shared/presentation/pagination.js';
import type {
  ProductSortField,
  ProductSortOrder,
} from '../../../application/ports/product.repository.port.js';

export class ProductQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsIn(['name', 'price'])
  sortBy?: ProductSortField;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: ProductSortOrder;
}
