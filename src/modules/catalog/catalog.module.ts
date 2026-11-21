import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CATEGORY_REPOSITORY } from './application/ports/category.repository.port.js';
import { PRODUCT_IMAGE_REPOSITORY } from './application/ports/product-image.repository.port.js';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port.js';
import { STORAGE_PORT } from './application/ports/storage.port.js';
import { CATALOG_READER } from './public/catalog-reader.port.js';
import { CatalogReaderAdapter } from './infrastructure/catalog-reader.adapter.js';
import { AddProductImageUseCase } from './application/use-cases/add-product-image.use-case.js';
import { ArchiveProductUseCase } from './application/use-cases/archive-product.use-case.js';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { GetProductImageUseCase } from './application/use-cases/get-product-image.use-case.js';
import { GetProductUseCase } from './application/use-cases/get-product.use-case.js';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case.js';
import { ListProductImagesUseCase } from './application/use-cases/list-product-images.use-case.js';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case.js';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case.js';
import { CategoryOrmEntity } from './infrastructure/persistence/category.orm-entity.js';
import { ProductImageOrmEntity } from './infrastructure/persistence/product-image.orm-entity.js';
import { ProductOrmEntity } from './infrastructure/persistence/product.orm-entity.js';
import { TypeOrmCategoryRepository } from './infrastructure/persistence/typeorm-category.repository.js';
import { TypeOrmProductImageRepository } from './infrastructure/persistence/typeorm-product-image.repository.js';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm-product.repository.js';
import { LocalFilesystemStorageAdapter } from './infrastructure/storage/local-filesystem-storage.adapter.js';
import { AdminCategoriesController } from './presentation/http/admin-categories.controller.js';
import { AdminProductImagesController } from './presentation/http/admin-product-images.controller.js';
import { AdminProductsController } from './presentation/http/admin-products.controller.js';
import { CategoriesController } from './presentation/http/categories.controller.js';
import { MediaController } from './presentation/http/media.controller.js';
import { ProductsController } from './presentation/http/products.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryOrmEntity,
      ProductOrmEntity,
      ProductImageOrmEntity,
    ]),
  ],
  controllers: [
    ProductsController,
    CategoriesController,
    MediaController,
    AdminProductsController,
    AdminProductImagesController,
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
    AddProductImageUseCase,
    ListProductImagesUseCase,
    GetProductImageUseCase,
    { provide: PRODUCT_REPOSITORY, useClass: TypeOrmProductRepository },
    { provide: CATEGORY_REPOSITORY, useClass: TypeOrmCategoryRepository },
    {
      provide: PRODUCT_IMAGE_REPOSITORY,
      useClass: TypeOrmProductImageRepository,
    },
    { provide: STORAGE_PORT, useClass: LocalFilesystemStorageAdapter },
    { provide: CATALOG_READER, useClass: CatalogReaderAdapter },
  ],
  exports: [CATALOG_READER],
})
export class CatalogModule {}
