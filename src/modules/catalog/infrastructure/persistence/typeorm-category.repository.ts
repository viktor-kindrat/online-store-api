import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Category } from '../../domain/entities/category.js';
import type { CategoryRepository } from '../../application/ports/category.repository.port.js';
import { CategoryOrmEntity } from './category.orm-entity.js';
import { toCategoryDomain, toCategoryOrm } from './category.mapper.js';

@Injectable()
export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repository: Repository<CategoryOrmEntity>,
  ) {}

  async findById(id: string): Promise<Category | null> {
    const row = await this.repository.findOne({ where: { id } });
    return row ? toCategoryDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const row = await this.repository.findOne({ where: { slug } });
    return row ? toCategoryDomain(row) : null;
  }

  async listAll(): Promise<Category[]> {
    const rows = await this.repository.find({ order: { name: 'ASC' } });
    return rows.map(toCategoryDomain);
  }

  async save(category: Category): Promise<void> {
    await this.repository.save(toCategoryOrm(category));
  }
}
