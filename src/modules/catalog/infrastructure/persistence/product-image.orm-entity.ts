import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'product_images' })
export class ProductImageOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'varchar', length: 500 })
  objectKey!: string;

  @Column({ type: 'integer' })
  sortOrder!: number;
}
