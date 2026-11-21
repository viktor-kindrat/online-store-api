import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class CategorySlugTakenError extends DomainError {
  readonly kind: DomainErrorKind = 'conflict';
  readonly code = 'CATEGORY_SLUG_TAKEN';

  constructor() {
    super('Category slug is already in use');
    this.name = 'CategorySlugTakenError';
  }
}
