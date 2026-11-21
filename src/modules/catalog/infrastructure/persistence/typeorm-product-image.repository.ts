import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ProductImage } from '../../domain/entities/product-image.js';
import type { ProductImageRepository } from '../../application/ports/product-image.repository.port.js';
import { ProductImageOrmEntity } from './product-image.orm-entity.js';
import {
  toProductImageDomain,
  toProductImageOrm,
} from './product-image.mapper.js';

@Injectable()
export class TypeOrmProductImageRepository implements ProductImageRepository {
  constructor(
    @InjectRepository(ProductImageOrmEntity)
    private readonly repository: Repository<ProductImageOrmEntity>,
  ) {}

  async findById(id: string): Promise<ProductImage | null> {
    const row = await this.repository.findOne({ where: { id } });
    return row ? toProductImageDomain(row) : null;
  }

  async findByProduct(productId: string): Promise<ProductImage[]> {
    const rows = await this.repository.find({
      where: { productId },
      order: { sortOrder: 'ASC' },
    });
    return rows.map(toProductImageDomain);
  }

  async countByProduct(productId: string): Promise<number> {
    return this.repository.count({ where: { productId } });
  }

  async save(image: ProductImage): Promise<void> {
    await this.repository.save(toProductImageOrm(image));
  }
}
