import { IsIn } from 'class-validator';
import { ORDER_STATUSES, type OrderStatus } from '../../../domain/order-status.js';

export class ChangeOrderStatusRequestDto {
  @IsIn([...ORDER_STATUSES])
  status!: OrderStatus;
}
