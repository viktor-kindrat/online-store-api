import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import type { UserRole } from '../../domain/user-role.js';

@Entity({ name: 'user_accounts' })
export class UserAccountOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 320 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 20 })
  role!: UserRole;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
