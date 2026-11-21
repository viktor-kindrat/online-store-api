import { randomUUID } from 'node:crypto';
import type { DeliveryMethodCode } from '../delivery-method.js';
import { InvalidOrderTransitionError } from '../errors/invalid-order-transition.error.js';
import {
  ALLOWED_ORDER_TRANSITIONS,
  type OrderStatus,
} from '../order-status.js';
import type { ShippingAddress } from '../shipping-address.js';
import { OrderItem } from './order-item.js';

export interface CreateOrderInput {
  customerId: string;
  items: OrderItem[];
  subtotalMinor: number;
  discountMinor: number;
  deliveryMethod: DeliveryMethodCode;
  deliveryFeeMinor: number;
  shippingAddress: ShippingAddress;
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public status: OrderStatus,
    public readonly items: OrderItem[],
    public readonly subtotalMinor: number,
    public readonly discountMinor: number,
    public readonly deliveryMethod: DeliveryMethodCode,
    public readonly deliveryFeeMinor: number,
    public readonly totalMinor: number,
    public readonly shippingAddress: ShippingAddress,
    public readonly createdAt: Date,
  ) {}

  static create(input: CreateOrderInput): Order {
    const totalMinor =
      input.subtotalMinor - input.discountMinor + input.deliveryFeeMinor;
    return new Order(
      randomUUID(),
      input.customerId,
      'PENDING_PAYMENT',
      input.items,
      input.subtotalMinor,
      input.discountMinor,
      input.deliveryMethod,
      input.deliveryFeeMinor,
      totalMinor,
      input.shippingAddress,
      new Date(),
    );
  }

  markPaid(): void {
    this.transitionTo('PAID');
  }

  cancel(): void {
    this.transitionTo('CANCELLED');
  }

  changeStatus(next: OrderStatus): void {
    this.transitionTo(next);
  }

  private transitionTo(next: OrderStatus): void {
    if (!ALLOWED_ORDER_TRANSITIONS[this.status].includes(next)) {
      throw new InvalidOrderTransitionError();
    }
    this.status = next;
  }
}
