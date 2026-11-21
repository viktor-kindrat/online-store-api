import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExpireReservationsUseCase } from '../application/use-cases/expire-reservations.use-case.js';

@Injectable()
export class ReservationExpiryScheduler {
  constructor(
    private readonly expireReservations: ExpireReservationsUseCase,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handle(): Promise<void> {
    await this.expireReservations.execute();
  }
}
