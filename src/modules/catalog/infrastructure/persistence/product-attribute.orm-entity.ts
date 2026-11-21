import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'product_attributes' })
export class ProductAttributeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 500 })
  value!: string;

  @Column({ type: 'integer' })
  sortOrder!: number;
}
