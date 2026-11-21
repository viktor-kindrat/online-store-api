import { randomUUID } from 'node:crypto';
import type { DiscountType } from '../discount-type.js';

export interface CreatePromotionInput {
  code: string;
  discountType: DiscountType;
  value: number;
  minOrderMinor: number;
  expiresAt: Date;
  usageLimit: number;
}

export class Promotion {
  constructor(
    public readonly id: string,
    public code: string,
    public discountType: DiscountType,
    public value: number,
    public minOrderMinor: number,
    public expiresAt: Date,
    public usageLimit: number,
  ) {}

  static create(input: CreatePromotionInput): Promotion {
    return new Promotion(
      randomUUID(),
      input.code.toUpperCase(),
      input.discountType,
      input.value,
      input.minOrderMinor,
      input.expiresAt,
      input.usageLimit,
    );
  }

  isExpired(now: Date): boolean {
    return this.expiresAt.getTime() <= now.getTime();
  }
}
