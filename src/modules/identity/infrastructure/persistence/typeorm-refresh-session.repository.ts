import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { RefreshSession } from '../../domain/entities/refresh-session.js';
import type { RefreshSessionRepository } from '../../application/ports/refresh-session.repository.port.js';
import { RefreshSessionOrmEntity } from './refresh-session.orm-entity.js';
import {
  toRefreshSessionDomain,
  toRefreshSessionOrm,
} from './refresh-session.mapper.js';

@Injectable()
export class TypeOrmRefreshSessionRepository
  implements RefreshSessionRepository
{
  constructor(
    @InjectRepository(RefreshSessionOrmEntity)
    private readonly repository: Repository<RefreshSessionOrmEntity>,
  ) {}

  async save(session: RefreshSession): Promise<void> {
    await this.repository.save(toRefreshSessionOrm(session));
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshSession | null> {
    const row = await this.repository.findOne({ where: { tokenHash } });
    return row ? toRefreshSessionDomain(row) : null;
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await this.repository.delete({ tokenHash });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }
}
