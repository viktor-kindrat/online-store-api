export class CartItemView {
  id: string;
  productId: string;
  name: string;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
}

export class CartView {
  id: string;
  items: CartItemView[];
  subtotalMinor: number;
}
