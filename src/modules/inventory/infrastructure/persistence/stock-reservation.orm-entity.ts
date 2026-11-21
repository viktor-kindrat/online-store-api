import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import type { ReservationStatus } from '../../domain/reservation-status.js';

@Entity({ name: 'stock_reservations' })
export class StockReservationOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  orderId!: string;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'integer' })
  quantity!: number;

  @Column({ type: 'varchar', length: 20 })
  status!: ReservationStatus;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;
}
