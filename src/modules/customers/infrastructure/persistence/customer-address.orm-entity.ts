import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'customer_addresses' })
export class CustomerAddressOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  customerId!: string;

  @Column({ type: 'varchar', length: 120 })
  city!: string;

  @Column({ type: 'varchar', length: 200 })
  street!: string;

  @Column({ type: 'varchar', length: 20 })
  postalCode!: string;
}
