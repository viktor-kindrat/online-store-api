import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMER_ADDRESS_REPOSITORY,
  type CustomerAddressRepository,
} from '../ports/customer-address.repository.port.js';
import {
  toCustomerAddressView,
  type CustomerAddressView,
} from '../results/customer-views.js';

@Injectable()
export class ListMyAddressesUseCase {
  constructor(
    @Inject(CUSTOMER_ADDRESS_REPOSITORY)
    private readonly addresses: CustomerAddressRepository,
  ) {}

  async execute(userId: string): Promise<CustomerAddressView[]> {
    const addresses = await this.addresses.findByCustomerId(userId);
    return addresses.map(toCustomerAddressView);
  }
}
