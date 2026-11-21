import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class MediaAssetNotFoundError extends DomainError {
  readonly kind: DomainErrorKind = 'not_found';
  readonly code = 'MEDIA_ASSET_NOT_FOUND';

  constructor() {
    super('Media asset not found');
    this.name = 'MediaAssetNotFoundError';
  }
}
