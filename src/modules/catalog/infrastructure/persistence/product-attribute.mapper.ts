import { ProductAttribute } from '../../domain/entities/product-attribute.js';
import { ProductAttributeOrmEntity } from './product-attribute.orm-entity.js';

export function toProductAttributeDomain(
  row: ProductAttributeOrmEntity,
): ProductAttribute {
  return new ProductAttribute(
    row.id,
    row.productId,
    row.name,
    row.value,
    row.sortOrder,
  );
}

export function toProductAttributeOrm(
  attribute: ProductAttribute,
): ProductAttributeOrmEntity {
  const row = new ProductAttributeOrmEntity();
  row.id = attribute.id;
  row.productId = attribute.productId;
  row.name = attribute.name;
  row.value = attribute.value;
  row.sortOrder = attribute.sortOrder;
  return row;
}
