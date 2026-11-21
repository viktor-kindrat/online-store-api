import { Inject, Injectable } from '@nestjs/common';
import type { UpdateProductInput } from '../../domain/entities/product.js';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error.js';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error.js';
import {
  CATEGORY_REPOSITORY,
  type CategoryRepository,
} from '../ports/category.repository.port.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../ports/product.repository.port.js';
import { toProductView, type ProductView } from '../results/catalog-views.js';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categories: CategoryRepository,
  ) {}

  async execute(id: string, command: UpdateProductInput): Promise<ProductView> {
    const product = await this.products.findById(id);
    if (!product) {
      throw new ProductNotFoundError();
    }
    if (command.categoryId !== undefined) {
      const category = await this.categories.findById(command.categoryId);
      if (!category) {
        throw new CategoryNotFoundError();
      }
    }
    product.update(command);
    await this.products.save(product);
    return toProductView(product);
  }
}
