import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import type { DiscountType } from '../../domain/discount-type.js';

@Entity({ name: 'promotions' })
export class PromotionOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 20 })
  discountType!: DiscountType;

  @Column({ type: 'integer' })
  value!: number;

  @Column({ type: 'integer' })
  minOrderMinor!: number;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ type: 'integer' })
  usageLimit!: number;
}
