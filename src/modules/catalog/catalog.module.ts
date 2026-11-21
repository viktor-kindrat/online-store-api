import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Env } from '../../infrastructure/config/env.schema.js';
import { InventoryModule } from '../inventory/inventory.module.js';
import { CATEGORY_REPOSITORY } from './application/ports/category.repository.port.js';
import { MEDIA_ASSET_REPOSITORY } from './application/ports/media-asset.repository.port.js';
import { MEDIA_URL_RESOLVER } from './application/ports/media-url.resolver.port.js';
import { PRODUCT_ATTRIBUTE_REPOSITORY } from './application/ports/product-attribute.repository.port.js';
import { PRODUCT_IMAGE_REPOSITORY } from './application/ports/product-image.repository.port.js';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port.js';
import { STORAGE_PORT } from './application/ports/storage.port.js';
import { CATALOG_READER } from './public/catalog-reader.port.js';
import { CatalogReaderAdapter } from './infrastructure/catalog-reader.adapter.js';
import { AddProductImageUseCase } from './application/use-cases/add-product-image.use-case.js';
import { ArchiveProductUseCase } from './application/use-cases/archive-product.use-case.js';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { GetMediaAssetUseCase } from './application/use-cases/get-media-asset.use-case.js';
import { GetProductImageUseCase } from './application/use-cases/get-product-image.use-case.js';
import { GetProductUseCase } from './application/use-cases/get-product.use-case.js';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case.js';
import { ListProductImagesUseCase } from './application/use-cases/list-product-images.use-case.js';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case.js';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case.js';
import { UploadMediaUseCase } from './application/use-cases/upload-media.use-case.js';
import { CategoryOrmEntity } from './infrastructure/persistence/category.orm-entity.js';
import { MediaAssetOrmEntity } from './infrastructure/persistence/media-asset.orm-entity.js';
import { ProductAttributeOrmEntity } from './infrastructure/persistence/product-attribute.orm-entity.js';
import { ProductImageOrmEntity } from './infrastructure/persistence/product-image.orm-entity.js';
import { ProductOrmEntity } from './infrastructure/persistence/product.orm-entity.js';
import { TypeOrmCategoryRepository } from './infrastructure/persistence/typeorm-category.repository.js';
import { TypeOrmMediaAssetRepository } from './infrastructure/persistence/typeorm-media-asset.repository.js';
import { TypeOrmProductAttributeRepository } from './infrastructure/persistence/typeorm-product-attribute.repository.js';
import { TypeOrmProductImageRepository } from './infrastructure/persistence/typeorm-product-image.repository.js';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm-product.repository.js';
import { PublicMediaUrlResolver } from './infrastructure/media/public-media-url.resolver.js';
import { LocalFilesystemStorageAdapter } from './infrastructure/storage/local-filesystem-storage.adapter.js';
import { S3StorageAdapter } from './infrastructure/storage/s3-storage.adapter.js';
import { AdminCategoriesController } from './presentation/http/admin-categories.controller.js';
import { AdminMediaController } from './presentation/http/admin-media.controller.js';
import { AdminProductImagesController } from './presentation/http/admin-product-images.controller.js';
import { AdminProductsController } from './presentation/http/admin-products.controller.js';
import { CategoriesController } from './presentation/http/categories.controller.js';
import { MediaAssetsController } from './presentation/http/media-assets.controller.js';
import { MediaController } from './presentation/http/media.controller.js';
import { ProductsController } from './presentation/http/products.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryOrmEntity,
      ProductOrmEntity,
      ProductImageOrmEntity,
      ProductAttributeOrmEntity,
      MediaAssetOrmEntity,
    ]),
    InventoryModule,
  ],
  controllers: [
    ProductsController,
    CategoriesController,
    MediaController,
    MediaAssetsController,
    AdminProductsController,
    AdminProductImagesController,
    AdminMediaController,
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
    UploadMediaUseCase,
    GetMediaAssetUseCase,
    { provide: PRODUCT_REPOSITORY, useClass: TypeOrmProductRepository },
    { provide: CATEGORY_REPOSITORY, useClass: TypeOrmCategoryRepository },
    {
      provide: PRODUCT_IMAGE_REPOSITORY,
      useClass: TypeOrmProductImageRepository,
    },
    {
      provide: PRODUCT_ATTRIBUTE_REPOSITORY,
      useClass: TypeOrmProductAttributeRepository,
    },
    { provide: MEDIA_ASSET_REPOSITORY, useClass: TypeOrmMediaAssetRepository },
    {
      provide: STORAGE_PORT,
      useFactory: (config: ConfigService<Env, true>) =>
        config.get('STORAGE_DRIVER', { infer: true }) === 's3'
          ? new S3StorageAdapter(config)
          : new LocalFilesystemStorageAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: MEDIA_URL_RESOLVER,
      useFactory: (config: ConfigService<Env, true>) => {
        const baseUrl = config.get('MEDIA_PUBLIC_BASE_URL', { infer: true });
        return new PublicMediaUrlResolver(
          baseUrl ? baseUrl.replace(/\/+$/, '') : undefined,
        );
      },
      inject: [ConfigService],
    },
    { provide: CATALOG_READER, useClass: CatalogReaderAdapter },
  ],
  exports: [CATALOG_READER],
})
export class CatalogModule {}
