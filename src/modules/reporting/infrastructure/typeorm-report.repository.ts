import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SOLD_ORDER_STATUSES } from '../application/report.constants.js';
import type {
  ReportReadPort,
  RevenueTotals,
  SalesByCategoryRow,
  TopProductRow,
} from '../application/ports/report-read.port.js';

interface RevenueQueryRow {
  totalMinor: number;
  orderCount: number;
}

@Injectable()
export class TypeOrmReportRepository implements ReportReadPort {
  constructor(private readonly dataSource: DataSource) {}

  async getRevenue(from: Date, to: Date): Promise<RevenueTotals> {
    const rows = (await this.dataSource.query(
      `SELECT COALESCE(SUM(o."totalMinor"), 0)::int AS "totalMinor",
              COUNT(*)::int AS "orderCount"
       FROM orders o
       WHERE o.status = ANY($1)
         AND o."createdAt" >= $2
         AND o."createdAt" <= $3`,
      [[...SOLD_ORDER_STATUSES], from, to],
    )) as RevenueQueryRow[];
    const row = rows[0];
    return {
      totalMinor: row?.totalMinor ?? 0,
      orderCount: row?.orderCount ?? 0,
    };
  }

  async getSalesByCategory(): Promise<SalesByCategoryRow[]> {
    return (await this.dataSource.query(
      `SELECT c.id AS "categoryId",
              c.name AS "categoryName",
              COALESCE(SUM(oi.quantity), 0)::int AS "unitsSold",
              COALESCE(SUM(oi.quantity * oi."unitPriceMinor"), 0)::int AS "revenueMinor"
       FROM order_items oi
       JOIN orders o ON o.id = oi."orderId"
       JOIN products p ON p.id = oi."productId"
       JOIN categories c ON c.id = p."categoryId"
       WHERE o.status = ANY($1)
       GROUP BY c.id, c.name
       ORDER BY "revenueMinor" DESC`,
      [[...SOLD_ORDER_STATUSES]],
    )) as SalesByCategoryRow[];
  }

  async getTopProducts(limit: number): Promise<TopProductRow[]> {
    return (await this.dataSource.query(
      `SELECT oi."productId" AS "productId",
              oi."productName" AS "productName",
              COALESCE(SUM(oi.quantity), 0)::int AS "unitsSold",
              COALESCE(SUM(oi.quantity * oi."unitPriceMinor"), 0)::int AS "revenueMinor"
       FROM order_items oi
       JOIN orders o ON o.id = oi."orderId"
       WHERE o.status = ANY($1)
       GROUP BY oi."productId", oi."productName"
       ORDER BY "unitsSold" DESC
       LIMIT $2`,
      [[...SOLD_ORDER_STATUSES], limit],
    )) as TopProductRow[];
  }
}
