import { Inject, Injectable } from '@nestjs/common';
import type { CustomerAddressInput } from '../../domain/entities/customer-address.js';
import { AddressNotFoundError } from '../../domain/errors/address-not-found.error.js';
import {
  CUSTOMER_ADDRESS_REPOSITORY,
  type CustomerAddressRepository,
} from '../ports/customer-address.repository.port.js';
import {
  toCustomerAddressView,
  type CustomerAddressView,
} from '../results/customer-views.js';

export interface UpdateMyAddressCommand {
  userId: string;
  addressId: string;
  input: CustomerAddressInput;
}

@Injectable()
export class UpdateMyAddressUseCase {
  constructor(
    @Inject(CUSTOMER_ADDRESS_REPOSITORY)
    private readonly addresses: CustomerAddressRepository,
  ) {}

  async execute(command: UpdateMyAddressCommand): Promise<CustomerAddressView> {
    const address = await this.addresses.findById(command.addressId);
    if (!address || address.customerId !== command.userId) {
      throw new AddressNotFoundError();
    }
    address.update(command.input);
    await this.addresses.save(address);
    return toCustomerAddressView(address);
  }
}
