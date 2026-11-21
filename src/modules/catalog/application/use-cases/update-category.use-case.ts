import { Inject, Injectable } from '@nestjs/common';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error.js';
import { CategorySlugTakenError } from '../../domain/errors/category-slug-taken.error.js';
import {
  CATEGORY_REPOSITORY,
  type CategoryRepository,
} from '../ports/category.repository.port.js';
import { toCategoryView, type CategoryView } from '../results/catalog-views.js';

export interface UpdateCategoryCommand {
  name?: string;
  slug?: string;
}

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categories: CategoryRepository,
  ) {}

  async execute(
    id: string,
    command: UpdateCategoryCommand,
  ): Promise<CategoryView> {
    const category = await this.categories.findById(id);
    if (!category) {
      throw new CategoryNotFoundError();
    }
    if (command.slug !== undefined && command.slug !== category.slug) {
      const bySlug = await this.categories.findBySlug(command.slug);
      if (bySlug) {
        throw new CategorySlugTakenError();
      }
      category.changeSlug(command.slug);
    }
    if (command.name !== undefined) {
      category.rename(command.name);
    }
    await this.categories.save(category);
    return toCategoryView(category);
  }
}
