import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class OrderNotPayableError extends DomainError {
  readonly kind: DomainErrorKind = 'conflict';
  readonly code = 'ORDER_NOT_PAYABLE';

  constructor() {
    super('Order is not awaiting payment');
    this.name = 'OrderNotPayableError';
  }
}
