import { randomUUID } from 'node:crypto';
import type { UserRole } from '../user-role.js';

export class UserAccount {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
  ) {}

  static register(email: string, passwordHash: string): UserAccount {
    return new UserAccount(randomUUID(), email.toLowerCase(), passwordHash, 'CUSTOMER');
  }
}
