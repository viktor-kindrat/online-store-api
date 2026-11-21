import { Inject, Injectable } from '@nestjs/common';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error.js';
import {
  PRODUCT_IMAGE_REPOSITORY,
  type ProductImageRepository,
} from '../ports/product-image.repository.port.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../ports/product.repository.port.js';
import {
  toProductImageView,
  toProductView,
  type ProductDetailView,
} from '../results/catalog-views.js';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository,
    @Inject(PRODUCT_IMAGE_REPOSITORY)
    private readonly images: ProductImageRepository,
  ) {}

  async execute(id: string): Promise<ProductDetailView> {
    const product = await this.products.findById(id);
    if (!product || product.status !== 'ACTIVE') {
      throw new ProductNotFoundError();
    }
    const view = toProductView(product);
    const images = await this.images.findByProduct(id);
    return {
      id: view.id,
      categoryId: view.categoryId,
      name: view.name,
      description: view.description,
      priceMinor: view.priceMinor,
      status: view.status,
      images: images.map(toProductImageView),
    };
  }
}
