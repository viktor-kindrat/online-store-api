import { Controller, Get } from '@nestjs/common';
import { Public } from '../../../identity/public/index.js';
import type { CategoryView } from '../../application/results/catalog-views.js';
import { ListCategoriesUseCase } from '../../application/use-cases/list-categories.use-case.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly listCategories: ListCategoriesUseCase) {}

  @Public()
  @Get()
  list(): Promise<CategoryView[]> {
    return this.listCategories.execute();
  }
}
