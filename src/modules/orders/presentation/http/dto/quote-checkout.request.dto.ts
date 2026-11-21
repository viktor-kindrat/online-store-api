import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  DELIVERY_METHOD_CODES,
  type DeliveryMethodCode,
} from '../../../domain/delivery-method.js';

export class QuoteCheckoutRequestDto {
  @IsIn([...DELIVERY_METHOD_CODES])
  deliveryMethod!: DeliveryMethodCode;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  promoCode?: string;
}
