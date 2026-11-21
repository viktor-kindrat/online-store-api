import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class CartItemNotFoundError extends DomainError {
  readonly kind: DomainErrorKind = 'not_found';
  readonly code = 'CART_ITEM_NOT_FOUND';

  constructor() {
    super('Cart item not found');
    this.name = 'CartItemNotFoundError';
  }
}
