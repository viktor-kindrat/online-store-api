import type { RefreshSession } from '../../domain/entities/refresh-session.js';

export const REFRESH_SESSION_REPOSITORY = 'REFRESH_SESSION_REPOSITORY';

export interface RefreshSessionRepository {
  save(session: RefreshSession): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<RefreshSession | null>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
