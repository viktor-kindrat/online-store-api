import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.js';
import { CategorySlugTakenError } from '../../domain/errors/category-slug-taken.error.js';
import {
  CATEGORY_REPOSITORY,
  type CategoryRepository,
} from '../ports/category.repository.port.js';
import { toCategoryView, type CategoryView } from '../results/catalog-views.js';

export interface CreateCategoryCommand {
  name: string;
  slug: string;
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categories: CategoryRepository,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<CategoryView> {
    const existing = await this.categories.findBySlug(command.slug);
    if (existing) {
      throw new CategorySlugTakenError();
    }
    const category = Category.create(command.name, command.slug);
    await this.categories.save(category);
    return toCategoryView(category);
  }
}
