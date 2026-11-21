import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { TransactionContext } from '../../../shared/application/transaction.js';
import { entityManagerOf } from '../../../shared/infrastructure/typeorm-unit-of-work.js';
import type {
  CartLineItem,
  CartReader,
  CartWriter,
} from '../public/cart-access.port.js';
import { CartItemOrmEntity } from './persistence/cart-item.orm-entity.js';
import { CartOrmEntity } from './persistence/cart.orm-entity.js';

@Injectable()
export class CartAccessAdapter implements CartReader, CartWriter {
  constructor(
    @InjectRepository(CartOrmEntity)
    private readonly carts: Repository<CartOrmEntity>,
    @InjectRepository(CartItemOrmEntity)
    private readonly items: Repository<CartItemOrmEntity>,
  ) {}

  async getItems(customerId: string): Promise<CartLineItem[]> {
    const cart = await this.carts.findOne({ where: { customerId } });
    if (!cart) {
      return [];
    }
    const rows = await this.items.find({ where: { cartId: cart.id } });
    return rows.map((row) => ({
      productId: row.productId,
      quantity: row.quantity,
    }));
  }

  async clear(customerId: string, tx: TransactionContext): Promise<void> {
    const manager = entityManagerOf(tx);
    const cart = await manager.findOne(CartOrmEntity, {
      where: { customerId },
    });
    if (!cart) {
      return;
    }
    await manager.delete(CartItemOrmEntity, { cartId: cart.id });
  }
}
