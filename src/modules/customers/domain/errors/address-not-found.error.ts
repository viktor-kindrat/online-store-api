import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class AddressNotFoundError extends DomainError {
  readonly kind: DomainErrorKind = 'not_found';
  readonly code = 'ADDRESS_NOT_FOUND';

  constructor() {
    super('Address not found');
    this.name = 'AddressNotFoundError';
  }
}
