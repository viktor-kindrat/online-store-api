import { Product } from '../../domain/entities/product.js';
import { ProductOrmEntity } from './product.orm-entity.js';

export function toProductDomain(row: ProductOrmEntity): Product {
  return new Product(
    row.id,
    row.categoryId,
    row.name,
    row.description,
    row.priceMinor,
    row.status,
  );
}

export function toProductOrm(product: Product): ProductOrmEntity {
  const row = new ProductOrmEntity();
  row.id = product.id;
  row.categoryId = product.categoryId;
  row.name = product.name;
  row.description = product.description;
  row.priceMinor = product.priceMinor;
  row.status = product.status;
  return row;
}
