import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { TransactionContext } from '../../../../shared/application/transaction.js';
import { entityManagerOf } from '../../../../shared/infrastructure/typeorm-unit-of-work.js';
import type { Order } from '../../domain/entities/order.js';
import type { OrderStatus } from '../../domain/order-status.js';
import type { OrderRepository } from '../../application/ports/order.repository.port.js';
import { OrderItemOrmEntity } from './order-item.orm-entity.js';
import { OrderOrmEntity } from './order.orm-entity.js';
import { toOrderDomain, toOrderItemOrm, toOrderOrm } from './order.mapper.js';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly orders: Repository<OrderOrmEntity>,
    @InjectRepository(OrderItemOrmEntity)
    private readonly items: Repository<OrderItemOrmEntity>,
  ) {}

  async create(order: Order, tx: TransactionContext): Promise<void> {
    const manager = entityManagerOf(tx);
    await manager.save(toOrderOrm(order));
    await manager.save(
      order.items.map((item) => toOrderItemOrm(order.id, item)),
    );
  }

  async findById(id: string): Promise<Order | null> {
    const row = await this.orders.findOne({ where: { id } });
    if (!row) {
      return null;
    }
    const itemRows = await this.items.find({ where: { orderId: id } });
    return toOrderDomain(row, itemRows);
  }

  async findByIdWithin(id: string, tx: TransactionContext): Promise<Order | null> {
    const manager = entityManagerOf(tx);
    const row = await manager.findOne(OrderOrmEntity, { where: { id } });
    if (!row) {
      return null;
    }
    const itemRows = await manager.find(OrderItemOrmEntity, {
      where: { orderId: id },
    });
    return toOrderDomain(row, itemRows);
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    const rows = await this.orders.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
    return this.loadWithItems(rows);
  }

  async findAll(): Promise<Order[]> {
    const rows = await this.orders.find({ order: { createdAt: 'DESC' } });
    return this.loadWithItems(rows);
  }

  async setStatus(
    orderId: string,
    status: OrderStatus,
    tx: TransactionContext,
  ): Promise<void> {
    await entityManagerOf(tx).update(OrderOrmEntity, { id: orderId }, { status });
  }

  private async loadWithItems(rows: OrderOrmEntity[]): Promise<Order[]> {
    const orders: Order[] = [];
    for (const row of rows) {
      const itemRows = await this.items.find({ where: { orderId: row.id } });
      orders.push(toOrderDomain(row, itemRows));
    }
    return orders;
  }
}
