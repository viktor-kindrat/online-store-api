import { Inject, Injectable } from '@nestjs/common';
import {
  CATEGORY_REPOSITORY,
  type CategoryRepository,
} from '../ports/category.repository.port.js';
import { toCategoryView, type CategoryView } from '../results/catalog-views.js';

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categories: CategoryRepository,
  ) {}

  async execute(): Promise<CategoryView[]> {
    const categories = await this.categories.listAll();
    return categories.map(toCategoryView);
  }
}
