import type { CustomerAddress } from '../../domain/entities/customer-address.js';

export const CUSTOMER_ADDRESS_REPOSITORY = 'CUSTOMER_ADDRESS_REPOSITORY';

export interface CustomerAddressRepository {
  findById(id: string): Promise<CustomerAddress | null>;
  findByCustomerId(customerId: string): Promise<CustomerAddress[]>;
  save(address: CustomerAddress): Promise<void>;
  delete(id: string): Promise<void>;
}
