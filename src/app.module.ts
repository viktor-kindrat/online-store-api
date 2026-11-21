import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { validateEnv } from './infrastructure/config/env.schema.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { CatalogModule } from './modules/catalog/catalog.module.js';
import { IdentityModule } from './modules/identity/identity.module.js';
import { DomainExceptionFilter } from './shared/presentation/domain-exception.filter.js';

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
    HealthModule,
    IdentityModule,
    CatalogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class AppModule {}
