import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class InsufficientStockError extends DomainError {
  readonly kind: DomainErrorKind = 'conflict';
  readonly code = 'INSUFFICIENT_STOCK';

  constructor() {
    super('Requested quantity exceeds available stock');
    this.name = 'InsufficientStockError';
  }
}
