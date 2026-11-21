import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { validateEnv } from './infrastructure/config/env.schema.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { CartModule } from './modules/cart/cart.module.js';
import { CatalogModule } from './modules/catalog/catalog.module.js';
import { IdentityModule } from './modules/identity/identity.module.js';
import { InventoryModule } from './modules/inventory/inventory.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { PromotionsModule } from './modules/promotions/promotions.module.js';
import { ReportingModule } from './modules/reporting/reporting.module.js';
import { DomainExceptionFilter } from './shared/presentation/domain-exception.filter.js';
import { SharedModule } from './shared/shared.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'online-store-api',
    }),
    DatabaseModule,
    SharedModule,
    HealthModule,
    IdentityModule,
    CatalogModule,
    InventoryModule,
    CartModule,
    PromotionsModule,
    OrdersModule,
    PaymentsModule,
    ReportingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class AppModule {}
