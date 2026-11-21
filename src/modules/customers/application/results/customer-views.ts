import type { CustomerAddress } from '../../domain/entities/customer-address.js';
import type { CustomerProfile } from '../../domain/entities/customer-profile.js';

export interface CustomerProfileView {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
}

export interface CustomerAddressView {
  id: string;
  city: string;
  street: string;
  postalCode: string;
}

export function toCustomerProfileView(
  profile: CustomerProfile,
): CustomerProfileView {
  return {
    id: profile.id,
    userId: profile.userId,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
  };
}

export function toCustomerAddressView(
  address: CustomerAddress,
): CustomerAddressView {
  return {
    id: address.id,
    city: address.city,
    street: address.street,
    postalCode: address.postalCode,
  };
}
