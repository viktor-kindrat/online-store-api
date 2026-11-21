import { Inject, Injectable } from '@nestjs/common';
import { AddressNotFoundError } from '../../domain/errors/address-not-found.error.js';
import {
  CUSTOMER_ADDRESS_REPOSITORY,
  type CustomerAddressRepository,
} from '../ports/customer-address.repository.port.js';

export interface RemoveMyAddressCommand {
  userId: string;
  addressId: string;
}

@Injectable()
export class RemoveMyAddressUseCase {
  constructor(
    @Inject(CUSTOMER_ADDRESS_REPOSITORY)
    private readonly addresses: CustomerAddressRepository,
  ) {}

  async execute(command: RemoveMyAddressCommand): Promise<void> {
    const address = await this.addresses.findById(command.addressId);
    if (!address || address.customerId !== command.userId) {
      throw new AddressNotFoundError();
    }
    await this.addresses.delete(command.addressId);
  }
}
