import { Inject, Injectable } from '@nestjs/common';
import {
  REFRESH_SESSION_REPOSITORY,
  type RefreshSessionRepository,
} from '../ports/refresh-session.repository.port.js';
import {
  TOKEN_SERVICE,
  type TokenService,
} from '../ports/token-service.port.js';

export interface LogoutCommand {
  refreshToken: string | undefined;
}

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(TOKEN_SERVICE) private readonly tokens: TokenService,
    @Inject(REFRESH_SESSION_REPOSITORY)
    private readonly sessions: RefreshSessionRepository,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    if (!command.refreshToken) {
      return;
    }
    await this.sessions.deleteByTokenHash(
      this.tokens.hashRefreshToken(command.refreshToken),
    );
  }
}
