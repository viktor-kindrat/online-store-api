import { randomUUID } from 'node:crypto';

export class ProductImage {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly objectKey: string,
    public readonly sortOrder: number,
  ) {}

  static create(
    productId: string,
    objectKey: string,
    sortOrder: number,
  ): ProductImage {
    return new ProductImage(randomUUID(), productId, objectKey, sortOrder);
  }
}
