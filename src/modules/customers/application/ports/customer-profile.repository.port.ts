import type { CustomerProfile } from '../../domain/entities/customer-profile.js';

export const CUSTOMER_PROFILE_REPOSITORY = 'CUSTOMER_PROFILE_REPOSITORY';

export interface CustomerProfileRepository {
  findByUserId(userId: string): Promise<CustomerProfile | null>;
  save(profile: CustomerProfile): Promise<void>;
}
