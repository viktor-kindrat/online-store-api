import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'stock_balances' })
export class StockBalanceOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'integer', default: 0 })
  onHand!: number;

  @Column({ type: 'integer', default: 0 })
  reserved!: number;
}
