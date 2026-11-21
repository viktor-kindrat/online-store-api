import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '../catalog/catalog.module.js';
import { CART_REPOSITORY } from './application/ports/cart.repository.port.js';
import { CartViewBuilder } from './application/services/cart-view.builder.js';
import { AddCartItemUseCase } from './application/use-cases/add-cart-item.use-case.js';
import { ChangeCartItemQuantityUseCase } from './application/use-cases/change-cart-item-quantity.use-case.js';
import { GetCartUseCase } from './application/use-cases/get-cart.use-case.js';
import { RemoveCartItemUseCase } from './application/use-cases/remove-cart-item.use-case.js';
import { CartAccessAdapter } from './infrastructure/cart-access.adapter.js';
import { CartItemOrmEntity } from './infrastructure/persistence/cart-item.orm-entity.js';
import { CartOrmEntity } from './infrastructure/persistence/cart.orm-entity.js';
import { TypeOrmCartRepository } from './infrastructure/persistence/typeorm-cart.repository.js';
import { CART_READER, CART_WRITER } from './public/cart-access.port.js';
import { CartController } from './presentation/http/cart.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartOrmEntity, CartItemOrmEntity]),
    CatalogModule,
  ],
  controllers: [CartController],
  providers: [
    GetCartUseCase,
    AddCartItemUseCase,
    ChangeCartItemQuantityUseCase,
    RemoveCartItemUseCase,
    CartViewBuilder,
    CartAccessAdapter,
    { provide: CART_REPOSITORY, useClass: TypeOrmCartRepository },
    { provide: CART_READER, useExisting: CartAccessAdapter },
    { provide: CART_WRITER, useExisting: CartAccessAdapter },
  ],
  exports: [CART_READER, CART_WRITER],
})
export class CartModule {}
