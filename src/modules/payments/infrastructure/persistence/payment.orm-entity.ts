import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import type { PaymentStatus } from '../../domain/payment-status.js';

@Entity({ name: 'payments' })
export class PaymentOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  orderId!: string;

  @Column({ type: 'integer' })
  amountMinor!: number;

  @Column({ type: 'varchar', length: 30 })
  provider!: string;

  @Column({ type: 'varchar', length: 20 })
  status!: PaymentStatus;
}
