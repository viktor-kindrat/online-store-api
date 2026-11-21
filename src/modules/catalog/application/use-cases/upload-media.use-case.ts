import { Inject, Injectable } from '@nestjs/common';
import { extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { MediaAsset } from '../../domain/entities/media-asset.js';
import { InvalidMediaAssetError } from '../../domain/errors/invalid-media-asset.error.js';
import {
  MEDIA_ASSET_REPOSITORY,
  type MediaAssetRepository,
} from '../ports/media-asset.repository.port.js';
import { STORAGE_PORT, type StoragePort } from '../ports/storage.port.js';
import { MediaAssetView } from '../results/catalog-views.js';

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

export interface UploadMediaCommand {
  originalName: string;
  buffer: Buffer;
  contentType: string;
}

@Injectable()
export class UploadMediaUseCase {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly assets: MediaAssetRepository,
    @Inject(STORAGE_PORT) private readonly storage: StoragePort,
  ) {}

  async execute(command: UploadMediaCommand): Promise<MediaAssetView> {
    if (!command.contentType.startsWith('image/') || command.buffer.length === 0) {
      throw new InvalidMediaAssetError();
    }
    const extension = this.extensionFor(command.originalName, command.contentType);
    const objectKey = `editor/${randomUUID()}${extension}`;
    await this.storage.put(objectKey, command.buffer, command.contentType);
    const asset = MediaAsset.create(objectKey, command.contentType);
    await this.assets.save(asset);
    return { id: asset.id, url: `/api/v1/media/assets/${asset.id}` };
  }

  private extensionFor(originalName: string, contentType: string): string {
    const fromName = extname(originalName).toLowerCase();
    if (fromName) {
      return fromName;
    }
    return EXTENSION_BY_TYPE[contentType] ?? '';
  }
}
