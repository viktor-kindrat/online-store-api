import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.js';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error.js';
import type { ProductStatus } from '../../domain/product-status.js';
import {
  CATEGORY_REPOSITORY,
  type CategoryRepository,
} from '../ports/category.repository.port.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../ports/product.repository.port.js';
import { toProductView, type ProductView } from '../results/catalog-views.js';

export interface CreateProductCommand {
  categoryId: string;
  name: string;
  description: string;
  priceMinor: number;
  status?: ProductStatus;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categories: CategoryRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductView> {
    const category = await this.categories.findById(command.categoryId);
    if (!category) {
      throw new CategoryNotFoundError();
    }
    const product = Product.create({
      categoryId: command.categoryId,
      name: command.name,
      description: command.description,
      priceMinor: command.priceMinor,
      status: command.status ?? 'ACTIVE',
    });
    await this.products.save(product);
    return toProductView(product);
  }
}
