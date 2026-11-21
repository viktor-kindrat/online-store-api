import { Inject, Injectable } from '@nestjs/common';
import { extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ProductImage } from '../../domain/entities/product-image.js';
import { InvalidProductImageError } from '../../domain/errors/invalid-product-image.error.js';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../ports/product.repository.port.js';
import {
  MEDIA_URL_RESOLVER,
  type MediaUrlResolver,
} from '../ports/media-url.resolver.port.js';
import {
  PRODUCT_IMAGE_REPOSITORY,
  type ProductImageRepository,
} from '../ports/product-image.repository.port.js';
import { STORAGE_PORT, type StoragePort } from '../ports/storage.port.js';
import {
  mediaUrlForImage,
  toProductImageView,
  type ProductImageView,
} from '../results/catalog-views.js';

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export interface AddProductImageCommand {
  productId: string;
  originalName: string;
  buffer: Buffer;
  contentType: string;
}

@Injectable()
export class AddProductImageUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository,
    @Inject(PRODUCT_IMAGE_REPOSITORY)
    private readonly images: ProductImageRepository,
    @Inject(STORAGE_PORT) private readonly storage: StoragePort,
    @Inject(MEDIA_URL_RESOLVER)
    private readonly mediaUrls: MediaUrlResolver,
  ) {}

  async execute(command: AddProductImageCommand): Promise<ProductImageView> {
    if (!command.contentType.startsWith('image/') || command.buffer.length === 0) {
      throw new InvalidProductImageError();
    }
    const product = await this.products.findById(command.productId);
    if (!product) {
      throw new ProductNotFoundError();
    }
    const extension = this.extensionFor(command.originalName, command.contentType);
    const objectKey = `products/${command.productId}/${randomUUID()}${extension}`;
    await this.storage.put(objectKey, command.buffer, command.contentType);
    const sortOrder = await this.images.countByProduct(command.productId);
    const image = ProductImage.create(command.productId, objectKey, sortOrder);
    await this.images.save(image);
    return toProductImageView(
      image,
      this.mediaUrls.resolve(image.objectKey, mediaUrlForImage(image.id)),
    );
  }

  private extensionFor(originalName: string, contentType: string): string {
    const fromName = extname(originalName).toLowerCase();
    if (fromName) {
      return fromName;
    }
    return EXTENSION_BY_TYPE[contentType] ?? '';
  }
}
