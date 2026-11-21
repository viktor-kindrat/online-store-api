import type { DiscountType } from '../discount-type.js';
import type { DiscountStrategy } from './discount-strategy.js';
import { FixedDiscountStrategy } from './fixed-discount.strategy.js';
import { PercentageDiscountStrategy } from './percentage-discount.strategy.js';

export class DiscountCalculator {
  private readonly strategies: Record<DiscountType, DiscountStrategy> = {
    PERCENTAGE: new PercentageDiscountStrategy(),
    FIXED_AMOUNT: new FixedDiscountStrategy(),
  };

  calculate(
    discountType: DiscountType,
    value: number,
    subtotalMinor: number,
  ): number {
    const raw = this.strategies[discountType].calculate(subtotalMinor, value);
    if (raw < 0) {
      return 0;
    }
    return Math.min(raw, subtotalMinor);
  }
}
