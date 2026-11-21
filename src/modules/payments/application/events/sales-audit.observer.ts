import { Injectable, Logger } from '@nestjs/common';
import type {
  OrderPaidEvent,
  OrderPaidObserver,
} from './order-paid.event.js';

@Injectable()
export class SalesAuditObserver implements OrderPaidObserver {
  private readonly logger = new Logger(SalesAuditObserver.name);

  handle(event: OrderPaidEvent): void {
    this.logger.log(
      `Recorded ${event.amountMinor} minor units for order ${event.orderId}`,
    );
  }
}
