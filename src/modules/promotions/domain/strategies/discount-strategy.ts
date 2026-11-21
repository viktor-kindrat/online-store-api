export interface DiscountStrategy {
  calculate(subtotalMinor: number, value: number): number;
}
