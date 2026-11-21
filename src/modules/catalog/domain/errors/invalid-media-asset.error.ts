import { DomainError, type DomainErrorKind } from '../../../../shared/domain/domain-error.js';

export class InvalidMediaAssetError extends DomainError {
  readonly kind: DomainErrorKind = 'unprocessable';
  readonly code = 'INVALID_MEDIA_ASSET';

  constructor() {
    super('Uploaded file is not a valid image');
    this.name = 'InvalidMediaAssetError';
  }
}
