import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class ProductUnavailableError extends DomainError {
  readonly kind: DomainErrorKind = 'not_found';
  readonly code = 'PRODUCT_UNAVAILABLE';

  constructor() {
    super('A product in the cart is no longer available');
    this.name = 'ProductUnavailableError';
  }
}
