import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'cart_items' })
export class CartItemOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  cartId!: string;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'integer' })
  quantity!: number;
}
