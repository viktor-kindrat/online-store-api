import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import type { PaginatedResult } from '../../../../shared/application/pagination.js';
import { Public } from '../../../identity/public/index.js';
import type {
  ProductDetailView,
  ProductImageView,
  ProductView,
} from '../../application/results/catalog-views.js';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case.js';
import { ListProductImagesUseCase } from '../../application/use-cases/list-product-images.use-case.js';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case.js';
import { ProductQueryDto } from './dto/product-query.dto.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly listProductImages: ListProductImagesUseCase,
  ) {}

  @Public()
  @Get()
  list(@Query() query: ProductQueryDto): Promise<PaginatedResult<ProductView>> {
    return this.listProducts.execute(query);
  }

  @Public()
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<ProductDetailView> {
    return this.getProduct.execute(id);
  }

  @Public()
  @Get(':id/images')
  images(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductImageView[]> {
    return this.listProductImages.execute(id);
  }
}
