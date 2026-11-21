import { randomUUID } from 'node:crypto';

export interface UpdateCustomerProfileInput {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
}

export class CustomerProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public firstName: string | null,
    public lastName: string | null,
    public phone: string | null,
  ) {}

  static createEmpty(userId: string): CustomerProfile {
    return new CustomerProfile(randomUUID(), userId, null, null, null);
  }

  update(input: UpdateCustomerProfileInput): void {
    if (input.firstName !== undefined) {
      this.firstName = input.firstName;
    }
    if (input.lastName !== undefined) {
      this.lastName = input.lastName;
    }
    if (input.phone !== undefined) {
      this.phone = input.phone;
    }
  }
}
