import { UserAccount } from '../../domain/entities/user-account.js';
import { UserAccountOrmEntity } from './user-account.orm-entity.js';

export function toUserAccountDomain(row: UserAccountOrmEntity): UserAccount {
  return new UserAccount(row.id, row.email, row.passwordHash, row.role);
}

export function toUserAccountOrm(user: UserAccount): UserAccountOrmEntity {
  const row = new UserAccountOrmEntity();
  row.id = user.id;
  row.email = user.email;
  row.passwordHash = user.passwordHash;
  row.role = user.role;
  return row;
}
