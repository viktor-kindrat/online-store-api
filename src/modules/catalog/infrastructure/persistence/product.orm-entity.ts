import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';
import type { ProductStatus } from '../../domain/product-status.js';

@Entity({ name: 'products' })
export class ProductOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  categoryId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'integer' })
  priceMinor!: number;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  status!: ProductStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
