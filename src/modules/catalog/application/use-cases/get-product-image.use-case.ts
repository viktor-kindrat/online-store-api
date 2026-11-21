import { Inject, Injectable } from '@nestjs/common';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error.js';
import {
  PRODUCT_IMAGE_REPOSITORY,
  type ProductImageRepository,
} from '../ports/product-image.repository.port.js';
import {
  STORAGE_PORT,
  type StoragePort,
  type StoredObject,
} from '../ports/storage.port.js';

@Injectable()
export class GetProductImageUseCase {
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY)
    private readonly images: ProductImageRepository,
    @Inject(STORAGE_PORT) private readonly storage: StoragePort,
  ) {}

  async execute(id: string): Promise<StoredObject> {
    const image = await this.images.findById(id);
    if (!image) {
      throw new ProductNotFoundError();
    }
    const stored = await this.storage.read(image.objectKey);
    if (!stored) {
      throw new ProductNotFoundError();
    }
    return stored;
  }
}
