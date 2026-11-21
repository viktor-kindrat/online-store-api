import { Inject, Injectable } from '@nestjs/common';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '../../../../shared/application/pagination.js';
import {
  PRODUCT_REPOSITORY,
  type ProductListFilter,
  type ProductRepository,
} from '../ports/product.repository.port.js';
import { toProductView, type ProductView } from '../results/catalog-views.js';

export interface ListProductsQuery {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
}

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository,
  ) {}

  async execute(query: ListProductsQuery): Promise<PaginatedResult<ProductView>> {
    const filter: ProductListFilter = {
      page: query.page,
      limit: query.limit,
      status: 'ACTIVE',
    };
    if (query.categoryId !== undefined) {
      filter.categoryId = query.categoryId;
    }
    if (query.search !== undefined) {
      filter.search = query.search;
    }
    const page = await this.products.list(filter);
    return buildPaginatedResult(
      page.items.map(toProductView),
      page.total,
      query.page,
      query.limit,
    );
  }
}
