import { Controller, Get } from '@nestjs/common';
import { Public } from '../../../identity/public/index.js';
import {
  DELIVERY_METHODS,
  type DeliveryMethodCode,
} from '../../domain/delivery-method.js';

interface DeliveryMethodView {
  code: DeliveryMethodCode;
  name: string;
  feeMinor: number;
}

@Controller('delivery-methods')
export class DeliveryMethodsController {
  @Public()
  @Get()
  list(): DeliveryMethodView[] {
    return Object.values(DELIVERY_METHODS).map((method) => ({
      code: method.code,
      name: method.name,
      feeMinor: method.feeMinor,
    }));
  }
}
