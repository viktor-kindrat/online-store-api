import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class InvalidProductPriceError extends DomainError {
  readonly kind: DomainErrorKind = 'unprocessable';
  readonly code = 'INVALID_PRODUCT_PRICE';

  constructor() {
    super('Product price must be zero or greater');
    this.name = 'InvalidProductPriceError';
  }
}
