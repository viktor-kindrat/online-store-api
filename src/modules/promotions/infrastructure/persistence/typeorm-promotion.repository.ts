import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import type { TransactionContext } from '../../../../shared/application/transaction.js';
import { entityManagerOf } from '../../../../shared/infrastructure/typeorm-unit-of-work.js';
import type { Promotion } from '../../domain/entities/promotion.js';
import type { PromotionRepository } from '../../application/ports/promotion.repository.port.js';
import { PromotionRedemptionOrmEntity } from './promotion-redemption.orm-entity.js';
import { PromotionOrmEntity } from './promotion.orm-entity.js';
import { toPromotionDomain, toPromotionOrm } from './promotion.mapper.js';

@Injectable()
export class TypeOrmPromotionRepository implements PromotionRepository {
  constructor(
    @InjectRepository(PromotionOrmEntity)
    private readonly promotions: Repository<PromotionOrmEntity>,
    @InjectRepository(PromotionRedemptionOrmEntity)
    private readonly redemptions: Repository<PromotionRedemptionOrmEntity>,
  ) {}

  async findByCode(code: string): Promise<Promotion | null> {
    const row = await this.promotions.findOne({ where: { code } });
    return row ? toPromotionDomain(row) : null;
  }

  async findById(id: string): Promise<Promotion | null> {
    const row = await this.promotions.findOne({ where: { id } });
    return row ? toPromotionDomain(row) : null;
  }

  async save(promotion: Promotion): Promise<void> {
    await this.promotions.save(toPromotionOrm(promotion));
  }

  async countRedemptions(promotionId: string): Promise<number> {
    return this.redemptions.count({ where: { promotionId } });
  }

  async recordRedemption(
    promotionId: string,
    orderId: string,
    tx: TransactionContext,
  ): Promise<void> {
    const row = new PromotionRedemptionOrmEntity();
    row.id = randomUUID();
    row.promotionId = promotionId;
    row.orderId = orderId;
    await entityManagerOf(tx).save(row);
  }

  async listAll(): Promise<Promotion[]> {
    const rows = await this.promotions.find({ order: { code: 'ASC' } });
    return rows.map(toPromotionDomain);
  }
}
