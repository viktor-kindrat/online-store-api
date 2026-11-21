import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CurrentUser, type AuthenticatedUser } from '../../../identity/public/index.js';
import type { OrderView } from '../../application/results/order-view.js';
import { CancelOrderUseCase } from '../../application/use-cases/cancel-order.use-case.js';
import { GetOrderUseCase } from '../../application/use-cases/get-order.use-case.js';
import { ListOrdersUseCase } from '../../application/use-cases/list-orders.use-case.js';
import { PlaceOrderUseCase } from '../../application/use-cases/place-order.use-case.js';
import { PlaceOrderRequestDto } from './dto/place-order.request.dto.js';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly placeOrder: PlaceOrderUseCase,
    private readonly listOrders: ListOrdersUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly cancelOrder: CancelOrderUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  place(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: PlaceOrderRequestDto,
  ): Promise<OrderView> {
    return this.placeOrder.execute({
      customerId: user.id,
      deliveryMethod: dto.deliveryMethod,
      shippingAddress: dto.shippingAddress,
    });
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser): Promise<OrderView[]> {
    return this.listOrders.execute(user.id);
  }

  @Get(':id')
  get(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderView> {
    return this.getOrder.execute({ customerId: user.id, orderId: id });
  }

  @Post(':id/cancellation')
  @HttpCode(HttpStatus.OK)
  cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderView> {
    return this.cancelOrder.execute({ customerId: user.id, orderId: id });
  }
}
