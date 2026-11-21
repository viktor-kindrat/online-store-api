import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class PromotionNotFoundError extends DomainError {
  readonly kind: DomainErrorKind = 'not_found';
  readonly code = 'PROMOTION_NOT_FOUND';

  constructor() {
    super('Promotion code not found');
    this.name = 'PromotionNotFoundError';
  }
}
