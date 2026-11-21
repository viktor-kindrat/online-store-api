import { describe, expect, it } from 'vitest';
import { InvalidProductPriceError } from '../errors/invalid-product-price.error.js';
import { Product } from './product.js';

const baseInput = {
  categoryId: 'category-1',
  name: 'Product',
  description: 'Description',
  priceMinor: 100,
  status: 'ACTIVE',
} as const;

describe('Product', () => {
  it('creates an active product', () => {
    const product = Product.create({ ...baseInput });
    expect(product.status).toBe('ACTIVE');
    expect(product.priceMinor).toBe(100);
  });

  it('rejects a negative price on create', () => {
    expect(() => Product.create({ ...baseInput, priceMinor: -1 })).toThrow(
      InvalidProductPriceError,
    );
  });

  it('rejects a negative price on update', () => {
    const product = Product.create({ ...baseInput });
    expect(() => product.update({ priceMinor: -5 })).toThrow(
      InvalidProductPriceError,
    );
  });

  it('archives a product', () => {
    const product = Product.create({ ...baseInput });
    product.archive();
    expect(product.status).toBe('ARCHIVED');
  });
});
