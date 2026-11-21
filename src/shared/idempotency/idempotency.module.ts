import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdempotencyInterceptor } from './idempotency.interceptor.js';
import { IdempotencyKeyOrmEntity } from './idempotency-key.orm-entity.js';
import { IDEMPOTENCY_STORE } from './idempotency.store.js';
import { TypeOrmIdempotencyStore } from './typeorm-idempotency.store.js';

@Module({
  imports: [TypeOrmModule.forFeature([IdempotencyKeyOrmEntity])],
  providers: [
    IdempotencyInterceptor,
    { provide: IDEMPOTENCY_STORE, useClass: TypeOrmIdempotencyStore },
  ],
  exports: [IdempotencyInterceptor, IDEMPOTENCY_STORE],
})
export class IdempotencyModule {}
