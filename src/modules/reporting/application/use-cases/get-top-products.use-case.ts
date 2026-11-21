import { Inject, Injectable } from '@nestjs/common';
import { TOP_PRODUCTS_DEFAULT_LIMIT } from '../report.constants.js';
import {
  REPORT_READ_PORT,
  type ReportReadPort,
} from '../ports/report-read.port.js';
import type { TopProductView } from '../results/report-views.js';

@Injectable()
export class GetTopProductsUseCase {
  constructor(
    @Inject(REPORT_READ_PORT) private readonly reports: ReportReadPort,
  ) {}

  execute(limit?: number): Promise<TopProductView[]> {
    return this.reports.getTopProducts(limit ?? TOP_PRODUCTS_DEFAULT_LIMIT);
  }
}
