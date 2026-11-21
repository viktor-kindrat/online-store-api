import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_IMAGE_REPOSITORY,
  type ProductImageRepository,
} from '../ports/product-image.repository.port.js';
import { toProductImageView, type ProductImageView } from '../results/catalog-views.js';

@Injectable()
export class ListProductImagesUseCase {
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY)
    private readonly images: ProductImageRepository,
  ) {}

  async execute(productId: string): Promise<ProductImageView[]> {
    const images = await this.images.findByProduct(productId);
    return images.map(toProductImageView);
  }
}
