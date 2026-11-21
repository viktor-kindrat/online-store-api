export interface RevenueReportView {
  from: string;
  to: string;
  totalMinor: number;
  orderCount: number;
}

export interface SalesByCategoryView {
  categoryId: string;
  categoryName: string;
  unitsSold: number;
  revenueMinor: number;
}

export interface TopProductView {
  productId: string;
  productName: string;
  unitsSold: number;
  revenueMinor: number;
}
