import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class PromotionCodeTakenError extends DomainError {
  readonly kind: DomainErrorKind = 'conflict';
  readonly code = 'PROMOTION_CODE_TAKEN';

  constructor() {
    super('Promotion code already exists');
    this.name = 'PromotionCodeTakenError';
  }
}
