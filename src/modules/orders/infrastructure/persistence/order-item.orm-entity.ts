import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'order_items' })
export class OrderItemOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  orderId!: string;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'varchar', length: 200 })
  productName!: string;

  @Column({ type: 'integer' })
  unitPriceMinor!: number;

  @Column({ type: 'integer' })
  quantity!: number;
}
