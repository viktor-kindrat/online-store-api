import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class PromotionExpiredError extends DomainError {
  readonly kind: DomainErrorKind = 'conflict';
  readonly code = 'PROMOTION_EXPIRED';

  constructor() {
    super('Promotion has expired');
    this.name = 'PromotionExpiredError';
  }
}
