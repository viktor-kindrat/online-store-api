import { randomUUID } from 'node:crypto';

export interface CustomerAddressInput {
  city: string;
  street: string;
  postalCode: string;
}

export class CustomerAddress {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public city: string,
    public street: string,
    public postalCode: string,
  ) {}

  static create(
    customerId: string,
    input: CustomerAddressInput,
  ): CustomerAddress {
    return new CustomerAddress(
      randomUUID(),
      customerId,
      input.city,
      input.street,
      input.postalCode,
    );
  }

  update(input: CustomerAddressInput): void {
    this.city = input.city;
    this.street = input.street;
    this.postalCode = input.postalCode;
  }
}
