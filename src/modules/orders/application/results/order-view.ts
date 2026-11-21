import type { Order } from '../../domain/entities/order.js';
import type { DeliveryMethodCode } from '../../domain/delivery-method.js';
import type { OrderStatus } from '../../domain/order-status.js';
import type { ShippingAddress } from '../../domain/shipping-address.js';

export interface OrderItemView {
  productId: string;
  productName: string;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
}

export interface OrderView {
  id: string;
  status: OrderStatus;
  subtotalMinor: number;
  discountMinor: number;
  deliveryMethod: DeliveryMethodCode;
  deliveryFeeMinor: number;
  totalMinor: number;
  shippingAddress: ShippingAddress;
  items: OrderItemView[];
  createdAt: string;
}

export function toOrderView(order: Order): OrderView {
  return {
    id: order.id,
    status: order.status,
    subtotalMinor: order.subtotalMinor,
    discountMinor: order.discountMinor,
    deliveryMethod: order.deliveryMethod,
    deliveryFeeMinor: order.deliveryFeeMinor,
    totalMinor: order.totalMinor,
    shippingAddress: order.shippingAddress,
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      unitPriceMinor: item.unitPriceMinor,
      quantity: item.quantity,
      lineTotalMinor: item.lineTotalMinor,
    })),
    createdAt: order.createdAt.toISOString(),
  };
}
