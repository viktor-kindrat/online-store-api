import type { Category } from '../../domain/entities/category.js';
import type { Product } from '../../domain/entities/product.js';
import type { ProductImage } from '../../domain/entities/product-image.js';
import type { ProductStatus } from '../../domain/product-status.js';

export class CategoryView {
  id: string;
  name: string;
  slug: string;
}

export class ProductView {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceMinor: number;
  status: ProductStatus;
}

export class ProductImageView {
  id: string;
  productId: string;
  url: string;
  sortOrder: number;
}

export class ProductDetailView extends ProductView {
  images: ProductImageView[];
}

export class ProductListResponse {
  items: ProductView[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

export function toProductImageView(image: ProductImage): ProductImageView {
  return {
    id: image.id,
    productId: image.productId,
    url: `/api/v1/media/${image.id}`,
    sortOrder: image.sortOrder,
  };
}
