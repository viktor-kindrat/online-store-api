import { randomUUID } from 'node:crypto';
import type { PaymentStatus } from '../payment-status.js';

export class PaymentAttempt {
  constructor(
    public readonly id: string,
    public readonly providerReference: string,
    public status: PaymentStatus,
  ) {}

  static create(providerReference: string): PaymentAttempt {
    return new PaymentAttempt(randomUUID(), providerReference, 'PENDING');
  }

  settle(status: PaymentStatus): void {
    this.status = status;
  }
}
