import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser, type AuthenticatedUser } from '../../../identity/public/index.js';
import type { CustomerProfileView } from '../../application/results/customer-views.js';
import { GetMyProfileUseCase } from '../../application/use-cases/get-my-profile.use-case.js';
import { UpdateMyProfileUseCase } from '../../application/use-cases/update-my-profile.use-case.js';
import { UpdateProfileRequestDto } from './dto/update-profile.request.dto.js';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly getMyProfile: GetMyProfileUseCase,
    private readonly updateMyProfile: UpdateMyProfileUseCase,
  ) {}

  @Get('me')
  get(@CurrentUser() user: AuthenticatedUser): Promise<CustomerProfileView> {
    return this.getMyProfile.execute(user.id);
  }

  @Patch('me')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileRequestDto,
  ): Promise<CustomerProfileView> {
    return this.updateMyProfile.execute({ userId: user.id, changes: dto });
  }
}
