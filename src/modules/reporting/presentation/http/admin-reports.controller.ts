import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from '../../../identity/public/index.js';
import { GetRevenueReportUseCase } from '../../application/use-cases/get-revenue-report.use-case.js';
import { GetSalesByCategoryUseCase } from '../../application/use-cases/get-sales-by-category.use-case.js';
import { GetTopProductsUseCase } from '../../application/use-cases/get-top-products.use-case.js';
import {
  RevenueReportView,
  SalesByCategoryView,
  TopProductView,
} from '../../application/results/report-views.js';
import { RevenueQueryDto } from './dto/revenue-query.dto.js';
import { TopProductsQueryDto } from './dto/top-products-query.dto.js';

@Roles('ADMIN')
@Controller('admin/reports')
export class AdminReportsController {
  constructor(
    private readonly getRevenueReport: GetRevenueReportUseCase,
    private readonly getSalesByCategory: GetSalesByCategoryUseCase,
    private readonly getTopProducts: GetTopProductsUseCase,
  ) {}

  @Get('revenue')
  revenue(@Query() query: RevenueQueryDto): Promise<RevenueReportView> {
    return this.getRevenueReport.execute(query);
  }

  @Get('sales-by-category')
  salesByCategory(): Promise<SalesByCategoryView[]> {
    return this.getSalesByCategory.execute();
  }

  @Get('top-products')
  topProducts(@Query() query: TopProductsQueryDto): Promise<TopProductView[]> {
    return this.getTopProducts.execute(query.limit);
  }
}
