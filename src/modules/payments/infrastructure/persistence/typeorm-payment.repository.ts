import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type EntityManager, Repository } from 'typeorm';
import type { TransactionContext } from '../../../../shared/application/transaction.js';
import { entityManagerOf } from '../../../../shared/infrastructure/typeorm-unit-of-work.js';
import type { Payment } from '../../domain/entities/payment.js';
import type { PaymentRepository } from '../../application/ports/payment.repository.port.js';
import { PaymentAttemptOrmEntity } from './payment-attempt.orm-entity.js';
import { PaymentOrmEntity } from './payment.orm-entity.js';
import {
  toPaymentAttemptOrm,
  toPaymentDomain,
  toPaymentOrm,
} from './payment.mapper.js';

@Injectable()
export class TypeOrmPaymentRepository implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentOrmEntity)
    private readonly payments: Repository<PaymentOrmEntity>,
    @InjectRepository(PaymentAttemptOrmEntity)
    private readonly attempts: Repository<PaymentAttemptOrmEntity>,
  ) {}

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const row = await this.payments.findOne({ where: { orderId } });
    if (!row) {
      return null;
    }
    const attemptRows = await this.attempts.find({
      where: { paymentId: row.id },
    });
    return toPaymentDomain(row, attemptRows);
  }

  async findByProviderReference(reference: string): Promise<Payment | null> {
    const attempt = await this.attempts.findOne({
      where: { providerReference: reference },
    });
    if (!attempt) {
      return null;
    }
    const row = await this.payments.findOne({
      where: { id: attempt.paymentId },
    });
    if (!row) {
      return null;
    }
    const attemptRows = await this.attempts.find({
      where: { paymentId: row.id },
    });
    return toPaymentDomain(row, attemptRows);
  }

  async save(payment: Payment): Promise<void> {
    await this.payments.manager.transaction((manager) =>
      this.persist(manager, payment),
    );
  }

  async saveWithin(payment: Payment, tx: TransactionContext): Promise<void> {
    await this.persist(entityManagerOf(tx), payment);
  }

  private async persist(manager: EntityManager, payment: Payment): Promise<void> {
    await manager.save(toPaymentOrm(payment));
    await manager.delete(PaymentAttemptOrmEntity, { paymentId: payment.id });
    if (payment.attempts.length > 0) {
      await manager.save(
        payment.attempts.map((attempt) =>
          toPaymentAttemptOrm(payment.id, attempt),
        ),
      );
    }
  }
}
