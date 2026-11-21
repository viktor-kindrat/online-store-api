import { Inject, Injectable } from '@nestjs/common';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '../../../../shared/application/pagination.js';
import {
  PRODUCT_IMAGE_REPOSITORY,
  type ProductImageRepository,
} from '../ports/product-image.repository.port.js';
import {
  PRODUCT_REPOSITORY,
  type ProductListFilter,
  type ProductRepository,
} from '../ports/product.repository.port.js';
import {
  mediaUrlForImage,
  toProductView,
  type ProductView,
} from '../results/catalog-views.js';

export interface ListProductsQuery {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
  sortBy?: ProductListFilter['sortBy'];
  sortOrder?: ProductListFilter['sortOrder'];
}

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository,
    @Inject(PRODUCT_IMAGE_REPOSITORY)
    private readonly images: ProductImageRepository,
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
    if (query.sortBy !== undefined) {
      filter.sortBy = query.sortBy;
    }
    if (query.sortOrder !== undefined) {
      filter.sortOrder = query.sortOrder;
    }
    const page = await this.products.list(filter);
    const primaryImages = await this.images.findPrimaryByProductIds(
      page.items.map((product) => product.id),
    );
    const items = page.items.map((product) => {
      const imageId = primaryImages.get(product.id);
      return toProductView(
        product,
        imageId ? mediaUrlForImage(imageId) : null,
      );
    });
    return buildPaginatedResult(items, page.total, query.page, query.limit);
  }
}
