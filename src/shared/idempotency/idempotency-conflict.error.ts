import { DomainError, type DomainErrorKind } from '../domain/domain-error.js';

export class IdempotencyConflictError extends DomainError {
  readonly kind: DomainErrorKind = 'conflict';
  readonly code = 'IDEMPOTENCY_KEY_CONFLICT';

  constructor() {
    super('Idempotency key was already used with a different request');
    this.name = 'IdempotencyConflictError';
  }
}
