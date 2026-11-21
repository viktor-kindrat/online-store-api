import { CustomerAddress } from '../../domain/entities/customer-address.js';
import { CustomerProfile } from '../../domain/entities/customer-profile.js';
import { CustomerAddressOrmEntity } from './customer-address.orm-entity.js';
import { CustomerProfileOrmEntity } from './customer-profile.orm-entity.js';

export function toCustomerProfileDomain(
  row: CustomerProfileOrmEntity,
): CustomerProfile {
  return new CustomerProfile(
    row.id,
    row.userId,
    row.firstName,
    row.lastName,
    row.phone,
  );
}

export function toCustomerProfileOrm(
  profile: CustomerProfile,
): CustomerProfileOrmEntity {
  const row = new CustomerProfileOrmEntity();
  row.id = profile.id;
  row.userId = profile.userId;
  row.firstName = profile.firstName;
  row.lastName = profile.lastName;
  row.phone = profile.phone;
  return row;
}

export function toCustomerAddressDomain(
  row: CustomerAddressOrmEntity,
): CustomerAddress {
  return new CustomerAddress(
    row.id,
    row.customerId,
    row.city,
    row.street,
    row.postalCode,
  );
}

export function toCustomerAddressOrm(
  address: CustomerAddress,
): CustomerAddressOrmEntity {
  const row = new CustomerAddressOrmEntity();
  row.id = address.id;
  row.customerId = address.customerId;
  row.city = address.city;
  row.street = address.street;
  row.postalCode = address.postalCode;
  return row;
}
