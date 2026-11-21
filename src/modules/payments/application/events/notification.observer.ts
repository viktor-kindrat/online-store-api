import { Injectable, Logger } from '@nestjs/common';
import type {
  OrderPaidEvent,
  OrderPaidObserver,
} from './order-paid.event.js';

@Injectable()
export class NotificationObserver implements OrderPaidObserver {
  private readonly logger = new Logger(NotificationObserver.name);

  handle(event: OrderPaidEvent): void {
    this.logger.log(`Notification queued for paid order ${event.orderId}`);
  }
}
