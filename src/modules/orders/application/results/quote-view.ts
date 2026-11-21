import type { DeliveryMethodCode } from '../../domain/delivery-method.js';

export interface QuoteLineView {
  productId: string;
  name: string;
  unitPriceMinor: number;
  quantity: number;
  availableQuantity: number;
  lineTotalMinor: number;
}

export interface QuoteView {
  items: QuoteLineView[];
  subtotalMinor: number;
  discountMinor: number;
  deliveryMethod: DeliveryMethodCode;
  deliveryFeeMinor: number;
  totalMinor: number;
}
