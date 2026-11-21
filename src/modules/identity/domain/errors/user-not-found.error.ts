import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class UserNotFoundError extends DomainError {
  readonly kind: DomainErrorKind = 'not_found';
  readonly code = 'USER_NOT_FOUND';

  constructor() {
    super('User not found');
    this.name = 'UserNotFoundError';
  }
}
