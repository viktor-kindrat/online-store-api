import { describe, expect, it } from 'vitest';
import { DiscountCalculator } from './discount-calculator.js';

describe('DiscountCalculator', () => {
  const calculator = new DiscountCalculator();

  it('applies a percentage discount', () => {
    expect(calculator.calculate('PERCENTAGE', 10, 10000)).toBe(1000);
  });

  it('applies a fixed discount', () => {
    expect(calculator.calculate('FIXED_AMOUNT', 3000, 10000)).toBe(3000);
  });

  it('never exceeds the subtotal', () => {
    expect(calculator.calculate('FIXED_AMOUNT', 99999, 10000)).toBe(10000);
  });

  it('never returns a negative discount', () => {
    expect(calculator.calculate('PERCENTAGE', -10, 10000)).toBe(0);
  });
});
