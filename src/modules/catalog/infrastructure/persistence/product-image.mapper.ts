import { ProductImage } from '../../domain/entities/product-image.js';
import { ProductImageOrmEntity } from './product-image.orm-entity.js';

export function toProductImageDomain(
  row: ProductImageOrmEntity,
): ProductImage {
  return new ProductImage(row.id, row.productId, row.objectKey, row.sortOrder);
}

export function toProductImageOrm(image: ProductImage): ProductImageOrmEntity {
  const row = new ProductImageOrmEntity();
  row.id = image.id;
  row.productId = image.productId;
  row.objectKey = image.objectKey;
  row.sortOrder = image.sortOrder;
  return row;
}
