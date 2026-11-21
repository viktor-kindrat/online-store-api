import type { Category } from '../../domain/entities/category.js';
import type { Product } from '../../domain/entities/product.js';
import type { ProductStatus } from '../../domain/product-status.js';

export interface CategoryView {
  id: string;
  name: string;
  slug: string;
}

export interface ProductView {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceMinor: number;
  status: ProductStatus;
}

export function toCategoryView(category: Category): CategoryView {
  return { id: category.id, name: category.name, slug: category.slug };
}

export function toProductView(product: Product): ProductView {
  return {
    id: product.id,
    categoryId: product.categoryId,
    name: product.name,
    description: product.description,
    priceMinor: product.priceMinor,
    status: product.status,
  };
}
