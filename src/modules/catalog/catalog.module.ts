import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CATEGORY_REPOSITORY } from './application/ports/category.repository.port.js';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port.js';
import { ArchiveProductUseCase } from './application/use-cases/archive-product.use-case.js';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { GetProductUseCase } from './application/use-cases/get-product.use-case.js';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case.js';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case.js';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case.js';
import { CategoryOrmEntity } from './infrastructure/persistence/category.orm-entity.js';
import { ProductOrmEntity } from './infrastructure/persistence/product.orm-entity.js';
import { TypeOrmCategoryRepository } from './infrastructure/persistence/typeorm-category.repository.js';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm-product.repository.js';
import { AdminCategoriesController } from './presentation/http/admin-categories.controller.js';
import { AdminProductsController } from './presentation/http/admin-products.controller.js';
import { CategoriesController } from './presentation/http/categories.controller.js';
import { ProductsController } from './presentation/http/products.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryOrmEntity, ProductOrmEntity])],
  controllers: [
    ProductsController,
    CategoriesController,
    AdminProductsController,
    AdminCategoriesController,
  ],
  providers: [
    ListProductsUseCase,
    GetProductUseCase,
    ListCategoriesUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    ArchiveProductUseCase,
    { provide: PRODUCT_REPOSITORY, useClass: TypeOrmProductRepository },
    { provide: CATEGORY_REPOSITORY, useClass: TypeOrmCategoryRepository },
  ],
})
export class CatalogModule {}
