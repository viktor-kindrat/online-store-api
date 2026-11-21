import { Inject, Injectable } from '@nestjs/common';
import {
  REPORT_READ_PORT,
  type ReportReadPort,
} from '../ports/report-read.port.js';
import type { RevenueReportView } from '../results/report-views.js';

export interface GetRevenueReportQuery {
  from?: string;
  to?: string;
}

@Injectable()
export class GetRevenueReportUseCase {
  constructor(
    @Inject(REPORT_READ_PORT) private readonly reports: ReportReadPort,
  ) {}

  async execute(query: GetRevenueReportQuery): Promise<RevenueReportView> {
    const from = query.from ? new Date(query.from) : new Date(0);
    const to = query.to ? new Date(query.to) : new Date();
    const totals = await this.reports.getRevenue(from, to);
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      totalMinor: totals.totalMinor,
      orderCount: totals.orderCount,
    };
  }
}
