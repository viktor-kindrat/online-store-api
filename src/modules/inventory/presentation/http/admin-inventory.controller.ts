import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Roles } from '../../../identity/public/index.js';
import { StockBalanceView } from '../../application/results/inventory-views.js';
import { AdjustStockUseCase } from '../../application/use-cases/adjust-stock.use-case.js';
import { ListStockUseCase } from '../../application/use-cases/list-stock.use-case.js';
import { AdjustStockRequestDto } from './dto/adjust-stock.request.dto.js';

@Roles('ADMIN')
@Controller('admin/inventory')
export class AdminInventoryController {
  constructor(
    private readonly listStock: ListStockUseCase,
    private readonly adjustStock: AdjustStockUseCase,
  ) {}

  @Get()
  list(): Promise<StockBalanceView[]> {
    return this.listStock.execute();
  }

  @Post('adjustments')
  @HttpCode(HttpStatus.NO_CONTENT)
  adjust(@Body() dto: AdjustStockRequestDto): Promise<void> {
    return this.adjustStock.execute(dto);
  }
}
