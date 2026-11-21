import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { UserAccount } from '../../domain/entities/user-account.js';
import type { UserAccountRepository } from '../../application/ports/user-account.repository.port.js';
import { UserAccountOrmEntity } from './user-account.orm-entity.js';
import {
  toUserAccountDomain,
  toUserAccountOrm,
} from './user-account.mapper.js';

@Injectable()
export class TypeOrmUserAccountRepository implements UserAccountRepository {
  constructor(
    @InjectRepository(UserAccountOrmEntity)
    private readonly repository: Repository<UserAccountOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserAccount | null> {
    const row = await this.repository.findOne({ where: { email } });
    return row ? toUserAccountDomain(row) : null;
  }

  async findById(id: string): Promise<UserAccount | null> {
    const row = await this.repository.findOne({ where: { id } });
    return row ? toUserAccountDomain(row) : null;
  }

  async save(user: UserAccount): Promise<void> {
    await this.repository.save(toUserAccountOrm(user));
  }
}
