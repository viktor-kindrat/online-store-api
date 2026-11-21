export const REPORT_READ_PORT = 'REPORT_READ_PORT';

export interface RevenueTotals {
  totalMinor: number;
  orderCount: number;
}

export interface SalesByCategoryRow {
  categoryId: string;
  categoryName: string;
  unitsSold: number;
  revenueMinor: number;
}

export interface TopProductRow {
  productId: string;
  productName: string;
  unitsSold: number;
  revenueMinor: number;
}

export interface ReportReadPort {
  getRevenue(from: Date, to: Date): Promise<RevenueTotals>;
  getSalesByCategory(): Promise<SalesByCategoryRow[]>;
  getTopProducts(limit: number): Promise<TopProductRow[]>;
}
