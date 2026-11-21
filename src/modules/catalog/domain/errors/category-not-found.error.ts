import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class CategoryNotFoundError extends DomainError {
  readonly kind: DomainErrorKind = 'not_found';
  readonly code = 'CATEGORY_NOT_FOUND';

  constructor() {
    super('Category not found');
    this.name = 'CategoryNotFoundError';
  }
}
