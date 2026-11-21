import { Category } from '../../domain/entities/category.js';
import { CategoryOrmEntity } from './category.orm-entity.js';

export function toCategoryDomain(row: CategoryOrmEntity): Category {
  return new Category(row.id, row.name, row.slug);
}

export function toCategoryOrm(category: Category): CategoryOrmEntity {
  const row = new CategoryOrmEntity();
  row.id = category.id;
  row.name = category.name;
  row.slug = category.slug;
  return row;
}
