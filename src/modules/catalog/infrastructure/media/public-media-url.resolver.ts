import type { MediaUrlResolver } from '../../application/ports/media-url.resolver.port.js';
import { mediaUrlForImage } from '../../application/results/catalog-views.js';
import type { ProductImage } from '../../domain/entities/product-image.js';

export class PublicMediaUrlResolver implements MediaUrlResolver {
  constructor(private readonly baseUrl: string | undefined) {}

  resolve(image: Pick<ProductImage, 'id' | 'objectKey'>): string {
    if (this.baseUrl) {
      return `${this.baseUrl}/${image.objectKey}`;
    }
    return mediaUrlForImage(image.id);
  }
}
