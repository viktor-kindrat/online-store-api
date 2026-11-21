import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  CatalogProductSnapshot,
  CatalogReader,
} from '../public/catalog-reader.port.js';
import { ProductOrmEntity } from './persistence/product.orm-entity.js';

@Injectable()
export class CatalogReaderAdapter implements CatalogReader {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly products: Repository<ProductOrmEntity>,
  ) {}

  async getActiveProduct(
    productId: string,
  ): Promise<CatalogProductSnapshot | null> {
    const row = await this.products.findOne({
      where: { id: productId, status: 'ACTIVE' },
    });
    return row
      ? { id: row.id, name: row.name, priceMinor: row.priceMinor }
      : null;
  }
}
