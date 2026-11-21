import type { UserRole } from '../../domain/user-role.js';

export const TOKEN_SERVICE = 'TOKEN_SERVICE';

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenService {
  issueAccessToken(payload: AccessTokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<AccessTokenPayload>;
  generateRefreshToken(): string;
  hashRefreshToken(token: string): string;
}
