import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INVENTORY_PORT } from './public/inventory.port.js';
import { AdjustStockUseCase } from './application/use-cases/adjust-stock.use-case.js';
import { ListStockUseCase } from './application/use-cases/list-stock.use-case.js';
import { StockBalanceOrmEntity } from './infrastructure/persistence/stock-balance.orm-entity.js';
import { StockReservationOrmEntity } from './infrastructure/persistence/stock-reservation.orm-entity.js';
import { TypeOrmInventoryAdapter } from './infrastructure/typeorm-inventory.adapter.js';
import { AdminInventoryController } from './presentation/http/admin-inventory.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockBalanceOrmEntity,
      StockReservationOrmEntity,
    ]),
  ],
  controllers: [AdminInventoryController],
  providers: [
    AdjustStockUseCase,
    ListStockUseCase,
    { provide: INVENTORY_PORT, useClass: TypeOrmInventoryAdapter },
  ],
  exports: [INVENTORY_PORT],
})
export class InventoryModule {}
