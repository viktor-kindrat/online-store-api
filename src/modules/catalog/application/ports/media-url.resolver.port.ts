import type { ProductImage } from '../../domain/entities/product-image.js';

export const MEDIA_URL_RESOLVER = 'MEDIA_URL_RESOLVER';

export interface MediaUrlResolver {
  resolve(image: Pick<ProductImage, 'id' | 'objectKey'>): string;
}
