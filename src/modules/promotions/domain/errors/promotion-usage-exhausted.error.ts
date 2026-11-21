import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class PromotionUsageExhaustedError extends DomainError {
  readonly kind: DomainErrorKind = 'conflict';
  readonly code = 'PROMOTION_USAGE_EXHAUSTED';

  constructor() {
    super('Promotion usage limit reached');
    this.name = 'PromotionUsageExhaustedError';
  }
}
