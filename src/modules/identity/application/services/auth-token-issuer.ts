import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import type { Env } from '../../../../infrastructure/config/env.schema.js';
import { RefreshSession } from '../../domain/entities/refresh-session.js';
import type { UserAccount } from '../../domain/entities/user-account.js';
import {
  REFRESH_SESSION_REPOSITORY,
  type RefreshSessionRepository,
} from '../ports/refresh-session.repository.port.js';
import {
  TOKEN_SERVICE,
  type AuthTokens,
  type TokenService,
} from '../ports/token-service.port.js';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class AuthTokenIssuer {
  constructor(
    @Inject(TOKEN_SERVICE) private readonly tokens: TokenService,
    @Inject(REFRESH_SESSION_REPOSITORY)
    private readonly sessions: RefreshSessionRepository,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async issue(user: UserAccount): Promise<AuthTokens> {
    const accessToken = await this.tokens.issueAccessToken({
      sub: user.id,
      role: user.role,
    });
    const refreshToken = this.tokens.generateRefreshToken();
    const ttlDays = this.config.get('REFRESH_TTL_DAYS', { infer: true });
    const expiresAt = new Date(Date.now() + ttlDays * MILLISECONDS_PER_DAY);
    await this.sessions.save(
      new RefreshSession(
        randomUUID(),
        user.id,
        this.tokens.hashRefreshToken(refreshToken),
        expiresAt,
      ),
    );
    return { accessToken, refreshToken };
  }
}
