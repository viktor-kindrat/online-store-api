import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class EmptyCartError extends DomainError {
  readonly kind: DomainErrorKind = 'unprocessable';
  readonly code = 'EMPTY_CART';

  constructor() {
    super('Cannot place an order with an empty cart');
    this.name = 'EmptyCartError';
  }
}
