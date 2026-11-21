import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../../../identity/public/index.js';
import { ProductView } from '../../application/results/catalog-views.js';
import { ArchiveProductUseCase } from '../../application/use-cases/archive-product.use-case.js';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case.js';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case.js';
import { CreateProductRequestDto } from './dto/create-product.request.dto.js';
import { UpdateProductRequestDto } from './dto/update-product.request.dto.js';

@Roles('ADMIN')
@Controller('admin/products')
export class AdminProductsController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly archiveProduct: ArchiveProductUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateProductRequestDto): Promise<ProductView> {
    return this.createProduct.execute(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductRequestDto,
  ): Promise<ProductView> {
    return this.updateProduct.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  archive(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.archiveProduct.execute(id);
  }
}
