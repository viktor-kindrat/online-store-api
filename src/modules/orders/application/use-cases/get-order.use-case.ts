import { Inject, Injectable } from '@nestjs/common';
import { OrderNotFoundError } from '../../domain/errors/order-not-found.error.js';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../ports/order.repository.port.js';
import { toOrderView, type OrderView } from '../results/order-view.js';

export interface GetOrderQuery {
  customerId: string;
  orderId: string;
}

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async execute(query: GetOrderQuery): Promise<OrderView> {
    const order = await this.orders.findById(query.orderId);
    if (!order || order.customerId !== query.customerId) {
      throw new OrderNotFoundError();
    }
    return toOrderView(order);
  }
}
