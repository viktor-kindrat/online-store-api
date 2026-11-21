import type { Product } from '../../domain/entities/product.js';
import type { ProductStatus } from '../../domain/product-status.js';

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface ProductListFilter {
  page: number;
  limit: number;
  status?: ProductStatus;
  categoryId?: string;
  search?: string;
}

export interface ProductListPage {
  items: Product[];
  total: number;
}

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  list(filter: ProductListFilter): Promise<ProductListPage>;
  save(product: Product): Promise<void>;
}
