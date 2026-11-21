import { Inject, Injectable } from '@nestjs/common';
import {
  MEDIA_URL_RESOLVER,
  type MediaUrlResolver,
} from '../ports/media-url.resolver.port.js';
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
    @Inject(MEDIA_URL_RESOLVER)
    private readonly mediaUrls: MediaUrlResolver,
  ) {}

  async execute(productId: string): Promise<ProductImageView[]> {
    const images = await this.images.findByProduct(productId);
    return images.map((image) =>
      toProductImageView(image, this.mediaUrls.resolve(image)),
    );
  }
}
