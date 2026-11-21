import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'refresh_sessions' })
export class RefreshSessionOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  tokenHash!: string;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;
}
