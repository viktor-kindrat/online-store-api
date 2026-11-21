import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class InvalidCredentialsError extends DomainError {
  readonly kind: DomainErrorKind = 'unauthorized';
  readonly code = 'INVALID_CREDENTIALS';

  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}
