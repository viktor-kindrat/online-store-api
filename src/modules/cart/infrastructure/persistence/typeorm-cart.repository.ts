import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import { Cart } from '../../domain/entities/cart.js';
import type { CartRepository } from '../../application/ports/cart.repository.port.js';
import { CartItemOrmEntity } from './cart-item.orm-entity.js';
import { CartOrmEntity } from './cart.orm-entity.js';
import { toCartDomain, toCartItemOrm } from './cart.mapper.js';

@Injectable()
export class TypeOrmCartRepository implements CartRepository {
  constructor(
    @InjectRepository(CartOrmEntity)
    private readonly carts: Repository<CartOrmEntity>,
    @InjectRepository(CartItemOrmEntity)
    private readonly items: Repository<CartItemOrmEntity>,
  ) {}

  async findByCustomerId(customerId: string): Promise<Cart | null> {
    const cart = await this.carts.findOne({ where: { customerId } });
    if (!cart) {
      return null;
    }
    const itemRows = await this.items.find({ where: { cartId: cart.id } });
    return toCartDomain(cart.id, cart.customerId, itemRows);
  }

  async getOrCreate(customerId: string): Promise<Cart> {
    const existing = await this.findByCustomerId(customerId);
    if (existing) {
      return existing;
    }
    const cart = new CartOrmEntity();
    cart.id = randomUUID();
    cart.customerId = customerId;
    await this.carts.save(cart);
    return new Cart(cart.id, customerId, []);
  }

  async save(cart: Cart): Promise<void> {
    await this.carts.manager.transaction(async (manager) => {
      const cartRow = new CartOrmEntity();
      cartRow.id = cart.id;
      cartRow.customerId = cart.customerId;
      await manager.save(cartRow);
      await manager.delete(CartItemOrmEntity, { cartId: cart.id });
      if (cart.items.length > 0) {
        await manager.save(
          cart.items.map((item) => toCartItemOrm(cart.id, item)),
        );
      }
    });
  }
}
