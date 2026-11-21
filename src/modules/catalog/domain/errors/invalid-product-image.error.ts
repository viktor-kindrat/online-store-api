import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class InvalidProductImageError extends DomainError {
  readonly kind: DomainErrorKind = 'unprocessable';
  readonly code = 'INVALID_PRODUCT_IMAGE';

  constructor() {
    super('Uploaded file is not a valid image');
    this.name = 'InvalidProductImageError';
  }
}
