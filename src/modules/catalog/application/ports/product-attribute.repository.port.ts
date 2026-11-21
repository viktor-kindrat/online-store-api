import type { ProductAttribute } from '../../domain/entities/product-attribute.js';

export const PRODUCT_ATTRIBUTE_REPOSITORY = 'PRODUCT_ATTRIBUTE_REPOSITORY';

export interface ProductAttributeInput {
  name: string;
  value: string;
}

export interface ProductAttributeRepository {
  findByProduct(productId: string): Promise<ProductAttribute[]>;
  replaceForProduct(
    productId: string,
    attributes: readonly ProductAttributeInput[],
  ): Promise<void>;
}
