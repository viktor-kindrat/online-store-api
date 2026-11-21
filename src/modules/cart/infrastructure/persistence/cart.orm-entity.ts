import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'carts' })
export class CartOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  customerId!: string;
}
