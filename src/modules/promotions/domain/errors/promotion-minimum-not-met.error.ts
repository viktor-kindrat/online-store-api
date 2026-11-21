import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class PromotionMinimumNotMetError extends DomainError {
  readonly kind: DomainErrorKind = 'unprocessable';
  readonly code = 'PROMOTION_MINIMUM_NOT_MET';

  constructor() {
    super('Order subtotal is below the promotion minimum');
    this.name = 'PromotionMinimumNotMetError';
  }
}
