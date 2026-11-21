import { Inject, Injectable } from '@nestjs/common';
import {
  CustomerAddress,
  type CustomerAddressInput,
} from '../../domain/entities/customer-address.js';
import {
  CUSTOMER_ADDRESS_REPOSITORY,
  type CustomerAddressRepository,
} from '../ports/customer-address.repository.port.js';
import {
  toCustomerAddressView,
  type CustomerAddressView,
} from '../results/customer-views.js';

export interface AddMyAddressCommand {
  userId: string;
  input: CustomerAddressInput;
}

@Injectable()
export class AddMyAddressUseCase {
  constructor(
    @Inject(CUSTOMER_ADDRESS_REPOSITORY)
    private readonly addresses: CustomerAddressRepository,
  ) {}

  async execute(command: AddMyAddressCommand): Promise<CustomerAddressView> {
    const address = CustomerAddress.create(command.userId, command.input);
    await this.addresses.save(address);
    return toCustomerAddressView(address);
  }
}
