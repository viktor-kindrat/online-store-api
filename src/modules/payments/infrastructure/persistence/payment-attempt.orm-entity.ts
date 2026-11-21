import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import type { PaymentStatus } from '../../domain/payment-status.js';

@Entity({ name: 'payment_attempts' })
export class PaymentAttemptOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  paymentId!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  providerReference!: string;

  @Column({ type: 'varchar', length: 20 })
  status!: PaymentStatus;
}
