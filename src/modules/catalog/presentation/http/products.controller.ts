import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import type { PaginatedResult } from '../../../../shared/application/pagination.js';
import { Public } from '../../../identity/public/index.js';
import type { ProductView } from '../../application/results/catalog-views.js';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case.js';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case.js';
import { ProductQueryDto } from './dto/product-query.dto.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductUseCase,
  ) {}

  @Public()
  @Get()
  list(@Query() query: ProductQueryDto): Promise<PaginatedResult<ProductView>> {
    return this.listProducts.execute(query);
  }

  @Public()
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<ProductView> {
    return this.getProduct.execute(id);
  }
}
