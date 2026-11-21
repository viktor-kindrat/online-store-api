export interface TransactionContext {
  readonly brand: 'TransactionContext';
}

export const TRANSACTION_MANAGER = 'TRANSACTION_MANAGER';

export interface TransactionManager {
  run<TResult>(
    work: (tx: TransactionContext) => Promise<TResult>,
  ): Promise<TResult>;
}
