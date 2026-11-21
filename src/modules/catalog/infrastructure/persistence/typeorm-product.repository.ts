import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, ILike, Repository } from 'typeorm';
import type { Product } from '../../domain/entities/product.js';
import type {
  ProductListFilter,
  ProductListPage,
  ProductRepository,
} from '../../application/ports/product.repository.port.js';
import { ProductOrmEntity } from './product.orm-entity.js';
import { toProductDomain, toProductOrm } from './product.mapper.js';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const row = await this.repository.findOne({ where: { id } });
    return row ? toProductDomain(row) : null;
  }

  async list(filter: ProductListFilter): Promise<ProductListPage> {
    const where: FindOptionsWhere<ProductOrmEntity> = {};
    if (filter.status) {
      where.status = filter.status;
    }
    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }
    if (filter.search) {
      where.name = ILike(`%${filter.search}%`);
    }
    const [rows, total] = await this.repository.findAndCount({
      where,
      skip: (filter.page - 1) * filter.limit,
      take: filter.limit,
      order: { name: 'ASC' },
    });
    return { items: rows.map(toProductDomain), total };
  }

  async save(product: Product): Promise<void> {
    await this.repository.save(toProductOrm(product));
  }
}
