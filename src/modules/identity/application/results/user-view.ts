import type { UserAccount } from '../../domain/entities/user-account.js';
import type { UserRole } from '../../domain/user-role.js';

export class UserView {
  id: string;
  email: string;
  role: UserRole;
}

export function toUserView(user: UserAccount): UserView {
  return { id: user.id, email: user.email, role: user.role };
}
