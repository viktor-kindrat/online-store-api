import { Module } from '@nestjs/common';
import { REPORT_READ_PORT } from './application/ports/report-read.port.js';
import { GetRevenueReportUseCase } from './application/use-cases/get-revenue-report.use-case.js';
import { GetSalesByCategoryUseCase } from './application/use-cases/get-sales-by-category.use-case.js';
import { GetTopProductsUseCase } from './application/use-cases/get-top-products.use-case.js';
import { TypeOrmReportRepository } from './infrastructure/typeorm-report.repository.js';
import { AdminReportsController } from './presentation/http/admin-reports.controller.js';

@Module({
  controllers: [AdminReportsController],
  providers: [
    GetRevenueReportUseCase,
    GetSalesByCategoryUseCase,
    GetTopProductsUseCase,
    { provide: REPORT_READ_PORT, useClass: TypeOrmReportRepository },
  ],
})
export class ReportingModule {}
