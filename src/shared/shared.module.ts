import { Global, Module } from '@nestjs/common';
import { TRANSACTION_MANAGER } from './application/transaction.js';
import { TypeOrmTransactionManager } from './infrastructure/typeorm-unit-of-work.js';

@Global()
@Module({
  providers: [
    { provide: TRANSACTION_MANAGER, useClass: TypeOrmTransactionManager },
  ],
  exports: [TRANSACTION_MANAGER],
})
export class SharedModule {}
