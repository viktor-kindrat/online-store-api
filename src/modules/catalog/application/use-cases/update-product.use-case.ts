import { Inject, Injectable } from '@nestjs/common';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error.js';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error.js';
import type { ProductStatus } from '../../domain/product-status.js';
import {
  CATEGORY_REPOSITORY,
  type CategoryRepository,
} from '../ports/category.repository.port.js';
import {
  PRODUCT_ATTRIBUTE_REPOSITORY,
  type ProductAttributeInput,
  type ProductAttributeRepository,
} from '../ports/product-attribute.repository.port.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../ports/product.repository.port.js';
import { toProductView, type ProductView } from '../results/catalog-views.js';

export interface UpdateProductCommand {
  categoryId?: string;
  name?: string;
  description?: string;
  priceMinor?: number;
  status?: ProductStatus;
  attributes?: ProductAttributeInput[];
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categories: CategoryRepository,
    @Inject(PRODUCT_ATTRIBUTE_REPOSITORY)
    private readonly attributes: ProductAttributeRepository,
  ) {}

  async execute(id: string, command: UpdateProductCommand): Promise<ProductView> {
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
    product.update({
      categoryId: command.categoryId,
      name: command.name,
      description: command.description,
      priceMinor: command.priceMinor,
      status: command.status,
    });
    await this.products.save(product);
    if (command.attributes !== undefined) {
      await this.attributes.replaceForProduct(product.id, command.attributes);
    }
    return toProductView(product);
  }
}
