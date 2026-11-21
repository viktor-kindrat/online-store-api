export const IDEMPOTENCY_STORE = 'IDEMPOTENCY_STORE';

export interface StoredIdempotentResponse {
  key: string;
  ownerId: string;
  requestFingerprint: string;
  responseStatus: number;
  responseBody: unknown;
}

export interface IdempotencyStore {
  find(key: string, ownerId: string): Promise<StoredIdempotentResponse | null>;
  save(record: StoredIdempotentResponse): Promise<void>;
}
