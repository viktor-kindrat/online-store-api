export const CATALOG_READER = 'CATALOG_READER';

export interface CatalogProductSnapshot {
  id: string;
  name: string;
  priceMinor: number;
}

export interface CatalogReader {
  getActiveProduct(productId: string): Promise<CatalogProductSnapshot | null>;
}
