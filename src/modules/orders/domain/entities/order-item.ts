export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly productName: string,
    public readonly unitPriceMinor: number,
    public readonly quantity: number,
  ) {}

  get lineTotalMinor(): number {
    return this.unitPriceMinor * this.quantity;
  }
}
