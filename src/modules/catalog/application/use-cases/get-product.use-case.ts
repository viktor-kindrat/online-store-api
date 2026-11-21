import { Inject, Injectable } from '@nestjs/common';
import {
  INVENTORY_PORT,
  type InventoryPort,
} from '../../../inventory/public/inventory.port.js';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error.js';
import {
  PRODUCT_ATTRIBUTE_REPOSITORY,
  type ProductAttributeRepository,
} from '../ports/product-attribute.repository.port.js';
import {
  PRODUCT_IMAGE_REPOSITORY,
  type ProductImageRepository,
} from '../ports/product-image.repository.port.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../ports/product.repository.port.js';
import {
  toProductAttributeView,
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
    @Inject(PRODUCT_ATTRIBUTE_REPOSITORY)
    private readonly attributes: ProductAttributeRepository,
    @Inject(INVENTORY_PORT) private readonly inventory: InventoryPort,
  ) {}

  async execute(id: string): Promise<ProductDetailView> {
    const product = await this.products.findById(id);
    if (!product || product.status !== 'ACTIVE') {
      throw new ProductNotFoundError();
    }
    const images = await this.images.findByProduct(id);
    const imageViews = images.map(toProductImageView);
    const view = toProductView(product, imageViews[0]?.url ?? null);
    const attributes = await this.attributes.findByProduct(id);
    const availableQuantity = await this.inventory.getAvailable(id);
    return {
      id: view.id,
      categoryId: view.categoryId,
      name: view.name,
      description: view.description,
      priceMinor: view.priceMinor,
      status: view.status,
      primaryImageUrl: view.primaryImageUrl,
      images: imageViews,
      attributes: attributes.map(toProductAttributeView),
      availableQuantity,
    };
  }
}
