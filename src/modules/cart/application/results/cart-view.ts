export interface CartItemView {
  id: string;
  productId: string;
  name: string;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
}

export interface CartView {
  id: string;
  items: CartItemView[];
  subtotalMinor: number;
}
