import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'promotion_redemptions' })
export class PromotionRedemptionOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  promotionId!: string;

  @Column({ type: 'uuid' })
  orderId!: string;
}
