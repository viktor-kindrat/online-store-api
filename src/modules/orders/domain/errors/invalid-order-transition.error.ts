import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class InvalidOrderTransitionError extends DomainError {
  readonly kind: DomainErrorKind = 'conflict';
  readonly code = 'INVALID_ORDER_TRANSITION';

  constructor() {
    super('Order status transition is not allowed');
    this.name = 'InvalidOrderTransitionError';
  }
}
