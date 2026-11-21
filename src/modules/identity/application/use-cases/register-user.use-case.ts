import { Inject, Injectable } from '@nestjs/common';
import { UserAccount } from '../../domain/entities/user-account.js';
import { EmailAlreadyRegisteredError } from '../../domain/errors/email-already-registered.error.js';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '../ports/password-hasher.port.js';
import {
  USER_ACCOUNT_REPOSITORY,
  type UserAccountRepository,
} from '../ports/user-account.repository.port.js';

export interface RegisterUserCommand {
  email: string;
  password: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_ACCOUNT_REPOSITORY)
    private readonly users: UserAccountRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<UserAccount> {
    const email = command.email.toLowerCase();
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyRegisteredError();
    }
    const passwordHash = await this.hasher.hash(command.password);
    const user = UserAccount.register(email, passwordHash);
    await this.users.save(user);
    return user;
  }
}
