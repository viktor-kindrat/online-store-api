import type { DiscountStrategy } from './discount-strategy.js';

export class FixedDiscountStrategy implements DiscountStrategy {
  calculate(_subtotalMinor: number, value: number): number {
    return value;
  }
}
