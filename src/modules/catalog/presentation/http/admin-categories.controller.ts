import { Body, Controller, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Roles } from '../../../identity/public/index.js';
import type { CategoryView } from '../../application/results/catalog-views.js';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case.js';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case.js';
import { CreateCategoryRequestDto } from './dto/create-category.request.dto.js';
import { UpdateCategoryRequestDto } from './dto/update-category.request.dto.js';

@Roles('ADMIN')
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(
    private readonly createCategory: CreateCategoryUseCase,
    private readonly updateCategory: UpdateCategoryUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateCategoryRequestDto): Promise<CategoryView> {
    return this.createCategory.execute(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryRequestDto,
  ): Promise<CategoryView> {
    return this.updateCategory.execute(id, dto);
  }
}
