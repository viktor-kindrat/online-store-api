import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { MediaAsset } from '../../domain/entities/media-asset.js';
import type { MediaAssetRepository } from '../../application/ports/media-asset.repository.port.js';
import { MediaAssetOrmEntity } from './media-asset.orm-entity.js';
import { toMediaAssetDomain, toMediaAssetOrm } from './media-asset.mapper.js';

@Injectable()
export class TypeOrmMediaAssetRepository implements MediaAssetRepository {
  constructor(
    @InjectRepository(MediaAssetOrmEntity)
    private readonly repository: Repository<MediaAssetOrmEntity>,
  ) {}

  async findById(id: string): Promise<MediaAsset | null> {
    const row = await this.repository.findOne({ where: { id } });
    return row ? toMediaAssetDomain(row) : null;
  }

  async save(asset: MediaAsset): Promise<void> {
    await this.repository.save(toMediaAssetOrm(asset));
  }
}
