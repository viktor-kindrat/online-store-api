import { Controller, Get } from '@nestjs/common';
import { Public } from '../../../identity/public/index.js';
import { DeliveryMethodView } from '../../application/results/delivery-method-view.js';
import { DELIVERY_METHODS } from '../../domain/delivery-method.js';

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
