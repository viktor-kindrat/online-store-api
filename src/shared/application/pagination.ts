export interface PaginatedResult<TItem> {
  items: TItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function buildPaginatedResult<TItem>(
  items: TItem[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<TItem> {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
