import { Inject, Injectable } from '@nestjs/common';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error.js';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '../ports/password-hasher.port.js';
import type { AuthTokens } from '../ports/token-service.port.js';
import {
  USER_ACCOUNT_REPOSITORY,
  type UserAccountRepository,
} from '../ports/user-account.repository.port.js';
import { toUserView, type UserView } from '../results/user-view.js';
import { AuthTokenIssuer } from '../services/auth-token-issuer.js';

export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResult {
  user: UserView;
  tokens: AuthTokens;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_ACCOUNT_REPOSITORY)
    private readonly users: UserAccountRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    private readonly issuer: AuthTokenIssuer,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user = await this.users.findByEmail(command.email.toLowerCase());
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const passwordMatches = await this.hasher.compare(
      command.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }
    const tokens = await this.issuer.issue(user);
    return { user: toUserView(user), tokens };
  }
}
