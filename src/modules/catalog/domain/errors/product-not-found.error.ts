import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class ProductNotFoundError extends DomainError {
  readonly kind: DomainErrorKind = 'not_found';
  readonly code = 'PRODUCT_NOT_FOUND';

  constructor() {
    super('Product not found');
    this.name = 'ProductNotFoundError';
  }
}
