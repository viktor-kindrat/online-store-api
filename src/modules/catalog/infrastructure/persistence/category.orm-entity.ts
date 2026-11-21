import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 160 })
  slug!: string;
}
