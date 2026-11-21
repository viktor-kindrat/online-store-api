import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class EmailAlreadyRegisteredError extends DomainError {
  readonly kind: DomainErrorKind = 'conflict';
  readonly code = 'EMAIL_ALREADY_REGISTERED';

  constructor() {
    super('Email is already registered');
    this.name = 'EmailAlreadyRegisteredError';
  }
}
