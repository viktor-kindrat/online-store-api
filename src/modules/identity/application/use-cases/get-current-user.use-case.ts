import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error.js';
import {
  USER_ACCOUNT_REPOSITORY,
  type UserAccountRepository,
} from '../ports/user-account.repository.port.js';
import { toUserView, type UserView } from '../results/user-view.js';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(USER_ACCOUNT_REPOSITORY)
    private readonly users: UserAccountRepository,
  ) {}

  async execute(userId: string): Promise<UserView> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    return toUserView(user);
  }
}
