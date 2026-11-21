import { Inject, Injectable } from '@nestjs/common';
import {
  CustomerProfile,
  type UpdateCustomerProfileInput,
} from '../../domain/entities/customer-profile.js';
import {
  CUSTOMER_PROFILE_REPOSITORY,
  type CustomerProfileRepository,
} from '../ports/customer-profile.repository.port.js';
import {
  toCustomerProfileView,
  type CustomerProfileView,
} from '../results/customer-views.js';

export interface UpdateMyProfileCommand {
  userId: string;
  changes: UpdateCustomerProfileInput;
}

@Injectable()
export class UpdateMyProfileUseCase {
  constructor(
    @Inject(CUSTOMER_PROFILE_REPOSITORY)
    private readonly profiles: CustomerProfileRepository,
  ) {}

  async execute(command: UpdateMyProfileCommand): Promise<CustomerProfileView> {
    const profile =
      (await this.profiles.findByUserId(command.userId)) ??
      CustomerProfile.createEmpty(command.userId);
    profile.update(command.changes);
    await this.profiles.save(profile);
    return toCustomerProfileView(profile);
  }
}
