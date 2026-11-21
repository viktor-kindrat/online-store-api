import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdempotencyKeyOrmEntity } from './idempotency-key.orm-entity.js';
import type {
  IdempotencyStore,
  StoredIdempotentResponse,
} from './idempotency.store.js';

@Injectable()
export class TypeOrmIdempotencyStore implements IdempotencyStore {
  constructor(
    @InjectRepository(IdempotencyKeyOrmEntity)
    private readonly repository: Repository<IdempotencyKeyOrmEntity>,
  ) {}

  async find(
    key: string,
    ownerId: string,
  ): Promise<StoredIdempotentResponse | null> {
    const row = await this.repository.findOne({ where: { key, ownerId } });
    if (!row) {
      return null;
    }
    return {
      key: row.key,
      ownerId: row.ownerId,
      requestFingerprint: row.requestFingerprint,
      responseStatus: row.responseStatus,
      responseBody: row.responseBody,
    };
  }

  async save(record: StoredIdempotentResponse): Promise<void> {
    const row = new IdempotencyKeyOrmEntity();
    row.key = record.key;
    row.ownerId = record.ownerId;
    row.requestFingerprint = record.requestFingerprint;
    row.responseStatus = record.responseStatus;
    row.responseBody = record.responseBody;
    await this.repository.save(row).catch(() => undefined);
  }
}
