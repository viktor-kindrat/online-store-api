import type { Category } from '../../domain/entities/category.js';

export const CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY';

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  listAll(): Promise<Category[]>;
  save(category: Category): Promise<void>;
}
