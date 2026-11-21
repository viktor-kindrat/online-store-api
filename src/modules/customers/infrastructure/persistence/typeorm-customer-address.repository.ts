import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CustomerAddress } from '../../domain/entities/customer-address.js';
import type { CustomerAddressRepository } from '../../application/ports/customer-address.repository.port.js';
import { CustomerAddressOrmEntity } from './customer-address.orm-entity.js';
import {
  toCustomerAddressDomain,
  toCustomerAddressOrm,
} from './customer.mapper.js';

@Injectable()
export class TypeOrmCustomerAddressRepository
  implements CustomerAddressRepository
{
  constructor(
    @InjectRepository(CustomerAddressOrmEntity)
    private readonly addresses: Repository<CustomerAddressOrmEntity>,
  ) {}

  async findById(id: string): Promise<CustomerAddress | null> {
    const row = await this.addresses.findOne({ where: { id } });
    return row ? toCustomerAddressDomain(row) : null;
  }

  async findByCustomerId(customerId: string): Promise<CustomerAddress[]> {
    const rows = await this.addresses.find({ where: { customerId } });
    return rows.map(toCustomerAddressDomain);
  }

  async save(address: CustomerAddress): Promise<void> {
    await this.addresses.save(toCustomerAddressOrm(address));
  }

  async delete(id: string): Promise<void> {
    await this.addresses.delete({ id });
  }
}
