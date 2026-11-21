import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class InvalidRefreshSessionError extends DomainError {
  readonly kind: DomainErrorKind = 'unauthorized';
  readonly code = 'INVALID_REFRESH_SESSION';

  constructor() {
    super('Refresh session is invalid or expired');
    this.name = 'InvalidRefreshSessionError';
  }
}
