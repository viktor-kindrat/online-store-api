import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class CartLimitExceededError extends DomainError {
  readonly kind: DomainErrorKind = 'unprocessable';
  readonly code = 'CART_LIMIT_EXCEEDED';

  constructor() {
    super('Cart limit exceeded');
    this.name = 'CartLimitExceededError';
  }
}
