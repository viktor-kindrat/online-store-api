import { Injectable } from '@nestjs/common';
import { DataSource, type EntityManager } from 'typeorm';
import type {
  TransactionContext,
  TransactionManager,
} from '../application/transaction.js';

export class TypeOrmTransactionContext implements TransactionContext {
  readonly brand = 'TransactionContext';

  constructor(public readonly manager: EntityManager) {}
}

export function entityManagerOf(tx: TransactionContext): EntityManager {
  return (tx as TypeOrmTransactionContext).manager;
}

@Injectable()
export class TypeOrmTransactionManager implements TransactionManager {
  constructor(private readonly dataSource: DataSource) {}

  run<TResult>(
    work: (tx: TransactionContext) => Promise<TResult>,
  ): Promise<TResult> {
    return this.dataSource.transaction((manager) =>
      work(new TypeOrmTransactionContext(manager)),
    );
  }
}
