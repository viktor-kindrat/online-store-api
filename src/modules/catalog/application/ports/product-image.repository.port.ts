import type { ProductImage } from '../../domain/entities/product-image.js';

export const PRODUCT_IMAGE_REPOSITORY = 'PRODUCT_IMAGE_REPOSITORY';

export interface ProductImageRepository {
  findById(id: string): Promise<ProductImage | null>;
  findByProduct(productId: string): Promise<ProductImage[]>;
  countByProduct(productId: string): Promise<number>;
  save(image: ProductImage): Promise<void>;
}
