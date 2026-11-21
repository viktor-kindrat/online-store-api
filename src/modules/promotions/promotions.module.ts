import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountCalculator } from './domain/strategies/discount-calculator.js';
import { PROMOTION_REPOSITORY } from './application/ports/promotion.repository.port.js';
import { PromotionsFacade } from './application/services/promotions.facade.js';
import { CreatePromotionUseCase } from './application/use-cases/create-promotion.use-case.js';
import { ListPromotionsUseCase } from './application/use-cases/list-promotions.use-case.js';
import { UpdatePromotionUseCase } from './application/use-cases/update-promotion.use-case.js';
import { PromotionRedemptionOrmEntity } from './infrastructure/persistence/promotion-redemption.orm-entity.js';
import { PromotionOrmEntity } from './infrastructure/persistence/promotion.orm-entity.js';
import { TypeOrmPromotionRepository } from './infrastructure/persistence/typeorm-promotion.repository.js';
import { PROMOTIONS_PORT } from './public/promotions.port.js';
import { AdminPromotionsController } from './presentation/http/admin-promotions.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromotionOrmEntity,
      PromotionRedemptionOrmEntity,
    ]),
  ],
  controllers: [AdminPromotionsController],
  providers: [
    CreatePromotionUseCase,
    UpdatePromotionUseCase,
    ListPromotionsUseCase,
    DiscountCalculator,
    PromotionsFacade,
    { provide: PROMOTION_REPOSITORY, useClass: TypeOrmPromotionRepository },
    { provide: PROMOTIONS_PORT, useExisting: PromotionsFacade },
  ],
  exports: [PROMOTIONS_PORT],
})
export class PromotionsModule {}
