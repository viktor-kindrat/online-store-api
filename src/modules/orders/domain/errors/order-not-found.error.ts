import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class OrderNotFoundError extends DomainError {
  readonly kind: DomainErrorKind = 'not_found';
  readonly code = 'ORDER_NOT_FOUND';

  constructor() {
    super('Order not found');
    this.name = 'OrderNotFoundError';
  }
}
