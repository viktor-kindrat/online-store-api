import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../ports/order.repository.port.js';
import { toOrderView, type OrderView } from '../results/order-view.js';

@Injectable()
export class ListAllOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async execute(): Promise<OrderView[]> {
    const orders = await this.orders.findAll();
    return orders.map(toOrderView);
  }
}
