import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_PAID_OBSERVERS,
  type OrderPaidEvent,
  type OrderPaidObserver,
} from './order-paid.event.js';

@Injectable()
export class OrderPaidPublisher {
  constructor(
    @Inject(ORDER_PAID_OBSERVERS)
    private readonly observers: OrderPaidObserver[],
  ) {}

  async publish(event: OrderPaidEvent): Promise<void> {
    for (const observer of this.observers) {
      await observer.handle(event);
    }
  }
}
