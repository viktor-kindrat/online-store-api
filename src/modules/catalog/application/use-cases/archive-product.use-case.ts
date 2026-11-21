import { Inject, Injectable } from '@nestjs/common';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../ports/product.repository.port.js';

@Injectable()
export class ArchiveProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.products.findById(id);
    if (!product) {
      throw new ProductNotFoundError();
    }
    product.archive();
    await this.products.save(product);
  }
}
