import { MediaAsset } from '../../domain/entities/media-asset.js';
import { MediaAssetOrmEntity } from './media-asset.orm-entity.js';

export function toMediaAssetDomain(row: MediaAssetOrmEntity): MediaAsset {
  return new MediaAsset(row.id, row.objectKey, row.contentType);
}

export function toMediaAssetOrm(asset: MediaAsset): MediaAssetOrmEntity {
  const row = new MediaAssetOrmEntity();
  row.id = asset.id;
  row.objectKey = asset.objectKey;
  row.contentType = asset.contentType;
  return row;
}
