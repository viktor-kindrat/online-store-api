export interface OrderPaidEvent {
  orderId: string;
  amountMinor: number;
}

export const ORDER_PAID_OBSERVERS = 'ORDER_PAID_OBSERVERS';

export interface OrderPaidObserver {
  handle(event: OrderPaidEvent): Promise<void> | void;
}
