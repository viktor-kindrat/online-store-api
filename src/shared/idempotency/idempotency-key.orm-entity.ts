import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'idempotency_keys' })
export class IdempotencyKeyOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  key!: string;

  @PrimaryColumn({ type: 'uuid' })
  ownerId!: string;

  @Column({ type: 'varchar', length: 64 })
  requestFingerprint!: string;

  @Column({ type: 'integer' })
  responseStatus!: number;

  @Column({ type: 'jsonb' })
  responseBody!: unknown;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
