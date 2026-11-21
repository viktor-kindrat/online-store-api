import type { Category } from '../../domain/entities/category.js';
import type { Product } from '../../domain/entities/product.js';
import type { ProductAttribute } from '../../domain/entities/product-attribute.js';
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
  primaryImageUrl: string | null;
}

export class ProductImageView {
  id: string;
  productId: string;
  url: string;
  sortOrder: number;
}

export class ProductAttributeView {
  name: string;
  value: string;
}

export class ProductDetailView extends ProductView {
  images: ProductImageView[];
  attributes: ProductAttributeView[];
  availableQuantity: number;
}

export class MediaAssetView {
  id: string;
  url: string;
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

export function mediaUrlForImage(imageId: string): string {
  return `/api/v1/media/${imageId}`;
}

export function toProductView(
  product: Product,
  primaryImageUrl: string | null = null,
): ProductView {
  return {
    id: product.id,
    categoryId: product.categoryId,
    name: product.name,
    description: product.description,
    priceMinor: product.priceMinor,
    status: product.status,
    primaryImageUrl,
  };
}

export function toProductImageView(
  image: ProductImage,
  url: string,
): ProductImageView {
  return {
    id: image.id,
    productId: image.productId,
    url,
    sortOrder: image.sortOrder,
  };
}

export function toProductAttributeView(
  attribute: ProductAttribute,
): ProductAttributeView {
  return { name: attribute.name, value: attribute.value };
}
