import type { MediaAsset } from '../../domain/entities/media-asset.js';

export const MEDIA_ASSET_REPOSITORY = 'MEDIA_ASSET_REPOSITORY';

export interface MediaAssetRepository {
  findById(id: string): Promise<MediaAsset | null>;
  save(asset: MediaAsset): Promise<void>;
}
