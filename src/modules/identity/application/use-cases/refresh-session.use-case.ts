import { Inject, Injectable } from '@nestjs/common';
import { InvalidRefreshSessionError } from '../../domain/errors/invalid-refresh-session.error.js';
import {
  REFRESH_SESSION_REPOSITORY,
  type RefreshSessionRepository,
} from '../ports/refresh-session.repository.port.js';
import {
  TOKEN_SERVICE,
  type AuthTokens,
  type TokenService,
} from '../ports/token-service.port.js';
import {
  USER_ACCOUNT_REPOSITORY,
  type UserAccountRepository,
} from '../ports/user-account.repository.port.js';
import { AuthTokenIssuer } from '../services/auth-token-issuer.js';

export interface RefreshSessionCommand {
  refreshToken: string;
}

@Injectable()
export class RefreshSessionUseCase {
  constructor(
    @Inject(TOKEN_SERVICE) private readonly tokens: TokenService,
    @Inject(REFRESH_SESSION_REPOSITORY)
    private readonly sessions: RefreshSessionRepository,
    @Inject(USER_ACCOUNT_REPOSITORY)
    private readonly users: UserAccountRepository,
    private readonly issuer: AuthTokenIssuer,
  ) {}

  async execute(command: RefreshSessionCommand): Promise<AuthTokens> {
    const tokenHash = this.tokens.hashRefreshToken(command.refreshToken);
    const session = await this.sessions.findByTokenHash(tokenHash);
    if (!session || session.isExpired(new Date())) {
      throw new InvalidRefreshSessionError();
    }
    const user = await this.users.findById(session.userId);
    if (!user) {
      throw new InvalidRefreshSessionError();
    }
    await this.sessions.deleteByTokenHash(tokenHash);
    return this.issuer.issue(user);
  }
}
