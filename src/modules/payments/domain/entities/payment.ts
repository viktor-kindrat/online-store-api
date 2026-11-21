import { randomUUID } from 'node:crypto';
import type { PaymentStatus } from '../payment-status.js';
import { PaymentAttempt } from './payment-attempt.js';

export class Payment {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly amountMinor: number,
    public readonly provider: string,
    public status: PaymentStatus,
    public attempts: PaymentAttempt[],
  ) {}

  static create(
    orderId: string,
    amountMinor: number,
    provider: string,
  ): Payment {
    return new Payment(randomUUID(), orderId, amountMinor, provider, 'PENDING', []);
  }

  addAttempt(providerReference: string): PaymentAttempt {
    const attempt = PaymentAttempt.create(providerReference);
    this.attempts.push(attempt);
    return attempt;
  }

  isSettled(): boolean {
    return this.status === 'SUCCEEDED';
  }

  markSucceeded(providerReference: string): void {
    this.status = 'SUCCEEDED';
    this.settleAttempt(providerReference, 'SUCCEEDED');
  }

  markFailed(providerReference: string): void {
    this.status = 'FAILED';
    this.settleAttempt(providerReference, 'FAILED');
  }

  private settleAttempt(providerReference: string, status: PaymentStatus): void {
    const attempt = this.attempts.find(
      (candidate) => candidate.providerReference === providerReference,
    );
    attempt?.settle(status);
  }
}
