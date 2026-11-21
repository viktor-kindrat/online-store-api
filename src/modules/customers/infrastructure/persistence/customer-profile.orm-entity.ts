import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'customer_profiles' })
export class CustomerProfileOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone!: string | null;
}
