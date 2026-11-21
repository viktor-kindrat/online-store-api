import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { Roles } from '../../../identity/public/index.js';
import type { OrderView } from '../../application/results/order-view.js';
import { ChangeOrderStatusUseCase } from '../../application/use-cases/change-order-status.use-case.js';
import { ListAllOrdersUseCase } from '../../application/use-cases/list-all-orders.use-case.js';
import { ChangeOrderStatusRequestDto } from './dto/change-order-status.request.dto.js';

@Roles('ADMIN')
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(
    private readonly listAllOrders: ListAllOrdersUseCase,
    private readonly changeOrderStatus: ChangeOrderStatusUseCase,
  ) {}

  @Get()
  list(): Promise<OrderView[]> {
    return this.listAllOrders.execute();
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeOrderStatusRequestDto,
  ): Promise<OrderView> {
    return this.changeOrderStatus.execute({ orderId: id, status: dto.status });
  }
}
