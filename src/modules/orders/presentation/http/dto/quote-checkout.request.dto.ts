import { IsIn } from 'class-validator';
import {
  DELIVERY_METHOD_CODES,
  type DeliveryMethodCode,
} from '../../../domain/delivery-method.js';

export class QuoteCheckoutRequestDto {
  @IsIn([...DELIVERY_METHOD_CODES])
  deliveryMethod!: DeliveryMethodCode;
}
