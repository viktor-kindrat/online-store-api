import { RefreshSession } from '../../domain/entities/refresh-session.js';
import { RefreshSessionOrmEntity } from './refresh-session.orm-entity.js';

export function toRefreshSessionDomain(
  row: RefreshSessionOrmEntity,
): RefreshSession {
  return new RefreshSession(row.id, row.userId, row.tokenHash, row.expiresAt);
}

export function toRefreshSessionOrm(
  session: RefreshSession,
): RefreshSessionOrmEntity {
  const row = new RefreshSessionOrmEntity();
  row.id = session.id;
  row.userId = session.userId;
  row.tokenHash = session.tokenHash;
  row.expiresAt = session.expiresAt;
  return row;
}
