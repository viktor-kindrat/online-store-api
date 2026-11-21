import { Inject, Injectable } from '@nestjs/common';
import { MediaAssetNotFoundError } from '../../domain/errors/media-asset-not-found.error.js';
import {
  MEDIA_ASSET_REPOSITORY,
  type MediaAssetRepository,
} from '../ports/media-asset.repository.port.js';
import {
  STORAGE_PORT,
  type StoragePort,
  type StoredObject,
} from '../ports/storage.port.js';

@Injectable()
export class GetMediaAssetUseCase {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly assets: MediaAssetRepository,
    @Inject(STORAGE_PORT) private readonly storage: StoragePort,
  ) {}

  async execute(id: string): Promise<StoredObject> {
    const asset = await this.assets.findById(id);
    if (!asset) {
      throw new MediaAssetNotFoundError();
    }
    const stored = await this.storage.read(asset.objectKey);
    if (!stored) {
      throw new MediaAssetNotFoundError();
    }
    return stored;
  }
}
