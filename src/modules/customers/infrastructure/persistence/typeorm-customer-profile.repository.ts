import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CustomerProfile } from '../../domain/entities/customer-profile.js';
import type { CustomerProfileRepository } from '../../application/ports/customer-profile.repository.port.js';
import { CustomerProfileOrmEntity } from './customer-profile.orm-entity.js';
import {
  toCustomerProfileDomain,
  toCustomerProfileOrm,
} from './customer.mapper.js';

@Injectable()
export class TypeOrmCustomerProfileRepository
  implements CustomerProfileRepository
{
  constructor(
    @InjectRepository(CustomerProfileOrmEntity)
    private readonly profiles: Repository<CustomerProfileOrmEntity>,
  ) {}

  async findByUserId(userId: string): Promise<CustomerProfile | null> {
    const row = await this.profiles.findOne({ where: { userId } });
    return row ? toCustomerProfileDomain(row) : null;
  }

  async save(profile: CustomerProfile): Promise<void> {
    await this.profiles.save(toCustomerProfileOrm(profile));
  }
}
