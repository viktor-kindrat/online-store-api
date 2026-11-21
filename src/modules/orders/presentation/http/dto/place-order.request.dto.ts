import { Type } from 'class-transformer';
import { IsIn, ValidateNested } from 'class-validator';
import {
  DELIVERY_METHOD_CODES,
  type DeliveryMethodCode,
} from '../../../domain/delivery-method.js';
import { ShippingAddressDto } from './shipping-address.dto.js';

export class PlaceOrderRequestDto {
  @IsIn([...DELIVERY_METHOD_CODES])
  deliveryMethod!: DeliveryMethodCode;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto;
}
