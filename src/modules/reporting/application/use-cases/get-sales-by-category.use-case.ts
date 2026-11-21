import { Inject, Injectable } from '@nestjs/common';
import {
  REPORT_READ_PORT,
  type ReportReadPort,
} from '../ports/report-read.port.js';
import type { SalesByCategoryView } from '../results/report-views.js';

@Injectable()
export class GetSalesByCategoryUseCase {
  constructor(
    @Inject(REPORT_READ_PORT) private readonly reports: ReportReadPort,
  ) {}

  execute(): Promise<SalesByCategoryView[]> {
    return this.reports.getSalesByCategory();
  }
}
