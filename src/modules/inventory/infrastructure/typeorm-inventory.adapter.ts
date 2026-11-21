import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import type { TransactionContext } from '../../../shared/application/transaction.js';
import { entityManagerOf } from '../../../shared/infrastructure/typeorm-unit-of-work.js';
import type {
  InventoryPort,
  ReservationItem,
  StockBalanceView,
} from '../public/inventory.port.js';
import { RESERVATION_TTL_MINUTES } from '../domain/inventory.constants.js';
import { InsufficientStockError } from '../domain/errors/insufficient-stock.error.js';
import { StockBalanceOrmEntity } from './persistence/stock-balance.orm-entity.js';
import { StockReservationOrmEntity } from './persistence/stock-reservation.orm-entity.js';

const MILLISECONDS_PER_MINUTE = 60 * 1000;

@Injectable()
export class TypeOrmInventoryAdapter implements InventoryPort {
  constructor(
    @InjectRepository(StockBalanceOrmEntity)
    private readonly balances: Repository<StockBalanceOrmEntity>,
  ) {}

  async reserveItems(
    orderId: string,
    items: readonly ReservationItem[],
    tx: TransactionContext,
  ): Promise<void> {
    const manager = entityManagerOf(tx);
    const expiresAt = new Date(
      Date.now() + RESERVATION_TTL_MINUTES * MILLISECONDS_PER_MINUTE,
    );
    for (const item of items) {
      const result = await manager
        .createQueryBuilder()
        .update(StockBalanceOrmEntity)
        .set({ reserved: () => 'reserved + :quantity' })
        .where('"productId" = :productId AND "onHand" - reserved >= :quantity')
        .setParameters({ productId: item.productId, quantity: item.quantity })
        .execute();
      if (!result.affected) {
        throw new InsufficientStockError();
      }
      const reservation = new StockReservationOrmEntity();
      reservation.id = randomUUID();
      reservation.orderId = orderId;
      reservation.productId = item.productId;
      reservation.quantity = item.quantity;
      reservation.status = 'ACTIVE';
      reservation.expiresAt = expiresAt;
      await manager.save(reservation);
    }
  }

  async commitReservation(orderId: string, tx: TransactionContext): Promise<void> {
    const manager = entityManagerOf(tx);
    const reservations = await manager.find(StockReservationOrmEntity, {
      where: { orderId, status: 'ACTIVE' },
    });
    for (const reservation of reservations) {
      await manager
        .createQueryBuilder()
        .update(StockBalanceOrmEntity)
        .set({
          onHand: () => '"onHand" - :quantity',
          reserved: () => 'reserved - :quantity',
        })
        .where('"productId" = :productId')
        .setParameters({
          productId: reservation.productId,
          quantity: reservation.quantity,
        })
        .execute();
      reservation.status = 'COMMITTED';
      await manager.save(reservation);
    }
  }

  async releaseReservation(orderId: string, tx: TransactionContext): Promise<void> {
    const manager = entityManagerOf(tx);
    const reservations = await manager.find(StockReservationOrmEntity, {
      where: { orderId, status: 'ACTIVE' },
    });
    for (const reservation of reservations) {
      await manager
        .createQueryBuilder()
        .update(StockBalanceOrmEntity)
        .set({ reserved: () => 'reserved - :quantity' })
        .where('"productId" = :productId')
        .setParameters({
          productId: reservation.productId,
          quantity: reservation.quantity,
        })
        .execute();
      reservation.status = 'RELEASED';
      await manager.save(reservation);
    }
  }

  async getAvailable(productId: string): Promise<number> {
    const balance = await this.balances.findOne({ where: { productId } });
    return balance ? balance.onHand - balance.reserved : 0;
  }

  async setOnHand(productId: string, onHand: number): Promise<void> {
    const existing = await this.balances.findOne({ where: { productId } });
    if (existing) {
      existing.onHand = onHand;
      await this.balances.save(existing);
      return;
    }
    const balance = new StockBalanceOrmEntity();
    balance.productId = productId;
    balance.onHand = onHand;
    balance.reserved = 0;
    await this.balances.save(balance);
  }

  async listBalances(): Promise<StockBalanceView[]> {
    const rows = await this.balances.find();
    return rows.map((row) => ({
      productId: row.productId,
      onHand: row.onHand,
      reserved: row.reserved,
      available: row.onHand - row.reserved,
    }));
  }

  async findExpiredReservationOrderIds(before: Date): Promise<string[]> {
    const rows = await this.balances.manager
      .createQueryBuilder(StockReservationOrmEntity, 'reservation')
      .select('DISTINCT reservation."orderId"', 'orderId')
      .where('reservation.status = :status AND reservation."expiresAt" < :before', {
        status: 'ACTIVE',
        before,
      })
      .getRawMany<{ orderId: string }>();
    return rows.map((row) => row.orderId);
  }
}
