import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import type { DeliveryMethodCode } from '../../domain/delivery-method.js';
import type { OrderStatus } from '../../domain/order-status.js';
import type { ShippingAddress } from '../../domain/shipping-address.js';

@Entity({ name: 'orders' })
export class OrderOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  customerId!: string;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  status!: OrderStatus;

  @Column({ type: 'integer' })
  subtotalMinor!: number;

  @Column({ type: 'integer' })
  discountMinor!: number;

  @Column({ type: 'varchar', length: 30 })
  deliveryMethod!: DeliveryMethodCode;

  @Column({ type: 'integer' })
  deliveryFeeMinor!: number;

  @Column({ type: 'integer' })
  totalMinor!: number;

  @Column({ type: 'jsonb' })
  shippingAddress!: ShippingAddress;

  @Column({ type: 'uuid', nullable: true })
  promotionId!: string | null;

  @Column({ type: 'timestamptz' })
  createdAt!: Date;
}
