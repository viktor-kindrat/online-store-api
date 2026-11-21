import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttribute } from '../../domain/entities/product-attribute.js';
import type {
  ProductAttributeInput,
  ProductAttributeRepository,
} from '../../application/ports/product-attribute.repository.port.js';
import { ProductAttributeOrmEntity } from './product-attribute.orm-entity.js';
import {
  toProductAttributeDomain,
  toProductAttributeOrm,
} from './product-attribute.mapper.js';

@Injectable()
export class TypeOrmProductAttributeRepository
  implements ProductAttributeRepository
{
  constructor(
    @InjectRepository(ProductAttributeOrmEntity)
    private readonly repository: Repository<ProductAttributeOrmEntity>,
  ) {}

  async findByProduct(productId: string): Promise<ProductAttribute[]> {
    const rows = await this.repository.find({
      where: { productId },
      order: { sortOrder: 'ASC' },
    });
    return rows.map(toProductAttributeDomain);
  }

  async replaceForProduct(
    productId: string,
    attributes: readonly ProductAttributeInput[],
  ): Promise<void> {
    await this.repository.manager.transaction(async (manager) => {
      await manager.delete(ProductAttributeOrmEntity, { productId });
      const rows = attributes.map((attribute, index) =>
        toProductAttributeOrm(
          ProductAttribute.create(
            productId,
            attribute.name,
            attribute.value,
            index,
          ),
        ),
      );
      if (rows.length > 0) {
        await manager.save(rows);
      }
    });
  }
}
