import { randomUUID } from 'node:crypto';

export class ProductAttribute {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly name: string,
    public readonly value: string,
    public readonly sortOrder: number,
  ) {}

  static create(
    productId: string,
    name: string,
    value: string,
    sortOrder: number,
  ): ProductAttribute {
    return new ProductAttribute(randomUUID(), productId, name, value, sortOrder);
  }
}
