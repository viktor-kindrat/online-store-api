import { Inject, Injectable } from '@nestjs/common';
import { CustomerProfile } from '../../domain/entities/customer-profile.js';
import {
  CUSTOMER_PROFILE_REPOSITORY,
  type CustomerProfileRepository,
} from '../ports/customer-profile.repository.port.js';
import {
  toCustomerProfileView,
  type CustomerProfileView,
} from '../results/customer-views.js';

@Injectable()
export class GetMyProfileUseCase {
  constructor(
    @Inject(CUSTOMER_PROFILE_REPOSITORY)
    private readonly profiles: CustomerProfileRepository,
  ) {}

  async execute(userId: string): Promise<CustomerProfileView> {
    const existing = await this.profiles.findByUserId(userId);
    if (existing) {
      return toCustomerProfileView(existing);
    }
    const profile = CustomerProfile.createEmpty(userId);
    await this.profiles.save(profile);
    return toCustomerProfileView(profile);
  }
}
