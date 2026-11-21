export class RevenueReportView {
  from: string;
  to: string;
  totalMinor: number;
  orderCount: number;
}

export class SalesByCategoryView {
  categoryId: string;
  categoryName: string;
  unitsSold: number;
  revenueMinor: number;
}

export class TopProductView {
  productId: string;
  productName: string;
  unitsSold: number;
  revenueMinor: number;
}
