import type { DiscountStrategy } from './discount-strategy.js';

const PERCENT_BASE = 100;

export class PercentageDiscountStrategy implements DiscountStrategy {
  calculate(subtotalMinor: number, value: number): number {
    return Math.floor((subtotalMinor * value) / PERCENT_BASE);
  }
}
