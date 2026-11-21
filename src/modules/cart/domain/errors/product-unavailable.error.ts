import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class ProductUnavailableError extends DomainError {
  readonly kind: DomainErrorKind = 'not_found';
  readonly code = 'PRODUCT_UNAVAILABLE';

  constructor() {
    super('Product is not available');
    this.name = 'ProductUnavailableError';
  }
}
