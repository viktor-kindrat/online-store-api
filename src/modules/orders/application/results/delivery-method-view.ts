import type { DeliveryMethodCode } from '../../domain/delivery-method.js';

export class DeliveryMethodView {
  code: DeliveryMethodCode;
  name: string;
  feeMinor: number;
}
