import { Order } from '../../domain/entities/order.js';
import { OrderItem } from '../../domain/entities/order-item.js';
import { OrderItemOrmEntity } from './order-item.orm-entity.js';
import { OrderOrmEntity } from './order.orm-entity.js';

export function toOrderDomain(
  row: OrderOrmEntity,
  itemRows: OrderItemOrmEntity[],
): Order {
  const items = itemRows.map(
    (item) =>
      new OrderItem(
        item.id,
        item.productId,
        item.productName,
        item.unitPriceMinor,
        item.quantity,
      ),
  );
  return new Order(
    row.id,
    row.customerId,
    row.status,
    items,
    row.subtotalMinor,
    row.discountMinor,
    row.deliveryMethod,
    row.deliveryFeeMinor,
    row.totalMinor,
    row.shippingAddress,
    row.createdAt,
  );
}

export function toOrderOrm(order: Order): OrderOrmEntity {
  const row = new OrderOrmEntity();
  row.id = order.id;
  row.customerId = order.customerId;
  row.status = order.status;
  row.subtotalMinor = order.subtotalMinor;
  row.discountMinor = order.discountMinor;
  row.deliveryMethod = order.deliveryMethod;
  row.deliveryFeeMinor = order.deliveryFeeMinor;
  row.totalMinor = order.totalMinor;
  row.shippingAddress = order.shippingAddress;
  row.createdAt = order.createdAt;
  return row;
}

export function toOrderItemOrm(
  orderId: string,
  item: OrderItem,
): OrderItemOrmEntity {
  const row = new OrderItemOrmEntity();
  row.id = item.id;
  row.orderId = orderId;
  row.productId = item.productId;
  row.productName = item.productName;
  row.unitPriceMinor = item.unitPriceMinor;
  row.quantity = item.quantity;
  return row;
}
