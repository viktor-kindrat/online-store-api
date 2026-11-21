import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/cart.module.js';
import { CatalogModule } from '../catalog/catalog.module.js';
import { InventoryModule } from '../inventory/inventory.module.js';
import { PromotionsModule } from '../promotions/promotions.module.js';
import { ORDER_REPOSITORY } from './application/ports/order.repository.port.js';
import { OrdersPaymentFacade } from './application/services/orders-payment.facade.js';
import { CancelOrderUseCase } from './application/use-cases/cancel-order.use-case.js';
import { ChangeOrderStatusUseCase } from './application/use-cases/change-order-status.use-case.js';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case.js';
import { ListAllOrdersUseCase } from './application/use-cases/list-all-orders.use-case.js';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case.js';
import { PlaceOrderUseCase } from './application/use-cases/place-order.use-case.js';
import { QuoteCheckoutUseCase } from './application/use-cases/quote-checkout.use-case.js';
import { OrderItemOrmEntity } from './infrastructure/persistence/order-item.orm-entity.js';
import { OrderOrmEntity } from './infrastructure/persistence/order.orm-entity.js';
import { TypeOrmOrderRepository } from './infrastructure/persistence/typeorm-order.repository.js';
import { ORDERS_PORT } from './public/orders.port.js';
import { AdminOrdersController } from './presentation/http/admin-orders.controller.js';
import { CheckoutController } from './presentation/http/checkout.controller.js';
import { DeliveryMethodsController } from './presentation/http/delivery-methods.controller.js';
import { OrdersController } from './presentation/http/orders.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderOrmEntity, OrderItemOrmEntity]),
    CatalogModule,
    CartModule,
    InventoryModule,
    PromotionsModule,
  ],
  controllers: [
    OrdersController,
    CheckoutController,
    DeliveryMethodsController,
    AdminOrdersController,
  ],
  providers: [
    PlaceOrderUseCase,
    QuoteCheckoutUseCase,
    GetOrderUseCase,
    ListOrdersUseCase,
    CancelOrderUseCase,
    ChangeOrderStatusUseCase,
    ListAllOrdersUseCase,
    OrdersPaymentFacade,
    { provide: ORDER_REPOSITORY, useClass: TypeOrmOrderRepository },
    { provide: ORDERS_PORT, useExisting: OrdersPaymentFacade },
  ],
  exports: [ORDERS_PORT],
})
export class OrdersModule {}
