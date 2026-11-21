import { randomUUID } from 'node:crypto';
import { InvalidProductPriceError } from '../errors/invalid-product-price.error.js';
import type { ProductStatus } from '../product-status.js';

export interface CreateProductInput {
  categoryId: string;
  name: string;
  description: string;
  priceMinor: number;
  status: ProductStatus;
}

export interface UpdateProductInput {
  categoryId?: string;
  name?: string;
  description?: string;
  priceMinor?: number;
  status?: ProductStatus;
}

export class Product {
  constructor(
    public readonly id: string,
    public categoryId: string,
    public name: string,
    public description: string,
    public priceMinor: number,
    public status: ProductStatus,
  ) {}

  static create(input: CreateProductInput): Product {
    Product.assertPrice(input.priceMinor);
    return new Product(
      randomUUID(),
      input.categoryId,
      input.name,
      input.description,
      input.priceMinor,
      input.status,
    );
  }

  update(input: UpdateProductInput): void {
    if (input.priceMinor !== undefined) {
      Product.assertPrice(input.priceMinor);
      this.priceMinor = input.priceMinor;
    }
    if (input.categoryId !== undefined) {
      this.categoryId = input.categoryId;
    }
    if (input.name !== undefined) {
      this.name = input.name;
    }
    if (input.description !== undefined) {
      this.description = input.description;
    }
    if (input.status !== undefined) {
      this.status = input.status;
    }
  }

  archive(): void {
    this.status = 'ARCHIVED';
  }

  private static assertPrice(priceMinor: number): void {
    if (priceMinor < 0) {
      throw new InvalidProductPriceError();
    }
  }
}
