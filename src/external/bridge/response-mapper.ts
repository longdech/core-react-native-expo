// response-mapper.ts
import {
  type BackendType,
  type InfiniteResponse,
  type ListResponse,
  type MappingConfig,
} from './types';

export class ResponseMapper {
  private config: MappingConfig;

  constructor(config: MappingConfig | BackendType) {
    if (typeof config === 'string') {
      this.config = this.getPresetConfig(config);
    } else {
      this.config = config;
    }
  }

  private getPresetConfig(backend: BackendType): MappingConfig {
    const presets: Record<Exclude<BackendType, 'custom'>, MappingConfig> = {
      laravel: {
        listDataPath: 'data',
        listTotalPath: 'total',
        listPagePath: 'current_page',
        listLimitPath: 'per_page',
        listTotalPagesPath: 'last_page',
        infiniteItemsPath: 'data',
        infiniteNextCursorPath: 'next_page_url',
        infinitePrevCursorPath: 'prev_page_url',
      },
      graphql: {
        listDataPath: 'items',
        listTotalPath: 'totalCount',
        infiniteItemsPath: 'items',
        infiniteNextCursorPath: 'pageInfo.endCursor',
        infinitePrevCursorPath: 'pageInfo.startCursor',
        infiniteHasNextPath: 'pageInfo.hasNextPage',
        infiniteHasPrevPath: 'pageInfo.hasPreviousPage',
      },
      nestjs: {
        listDataPath: 'data',
        listTotalPath: 'meta.total',
        listPagePath: 'meta.page',
        listLimitPath: 'meta.limit',
        listTotalPagesPath: 'meta.totalPages',
        infiniteItemsPath: 'data',
        infiniteNextCursorPath: 'meta.nextCursor',
        infinitePrevCursorPath: 'meta.prevCursor',
        infiniteHasNextPath: 'meta.hasNextPage',
        infiniteHasPrevPath: 'meta.hasPreviousPage',
      },
      java: {
        listDataPath: 'content',
        listTotalPath: 'totalElements',
        listPagePath: 'number',
        listLimitPath: 'size',
        listTotalPagesPath: 'totalPages',
        infiniteItemsPath: 'content',
        infiniteNextCursorPath: 'number',
        infinitePrevCursorPath: 'number',
        infiniteHasNextPath: 'last',
        infiniteHasPrevPath: 'first',
        transformPage: (page: number) => page + 1,
        transformCursor: (page: number) => page,
      },
      dotnet: {
        listDataPath: 'items',
        listTotalPath: 'totalCount',
        listPagePath: 'currentPage',
        listLimitPath: 'pageSize',
        listTotalPagesPath: 'totalPages',
        infiniteItemsPath: 'items',
        infiniteNextCursorPath: 'currentPage',
        infinitePrevCursorPath: 'currentPage',
        infiniteHasNextPath: 'hasNextPage',
        infiniteHasPrevPath: 'hasPreviousPage',
      },
    };

    return presets[backend as Exclude<BackendType, 'custom'>] ?? {};
  }

  mapList<T>(payload: unknown): ListResponse<T> {
    // Helper function để lấy number an toàn
    const getNumber = (path: string, defaultValue: number): number => {
      const value = this.getByPath(payload, path);
      const num = Number(value ?? defaultValue);
      return isNaN(num) ? defaultValue : num;
    };

    const data = this.getByPath(payload, this.config.listDataPath ?? 'data') ?? [];

    let currentPage = getNumber(this.config.listPagePath ?? 'page', 1);
    const perPage = getNumber(
      this.config.listLimitPath ?? 'limit',
      Array.isArray(data) ? data.length : 1,
    );
    const total = getNumber(this.config.listTotalPath ?? 'total', 0);

    // Apply page transformer
    if (this.config.transformPage) {
      currentPage = this.config.transformPage(currentPage);
    }

    let totalPages = getNumber(this.config.listTotalPagesPath ?? 'totalPages', 0);
    if (totalPages <= 0) {
      totalPages = Math.ceil(total / perPage);
    }

    return {
      data: Array.isArray(data) ? (data as T[]) : [],
      meta: {
        currentPage,
        perPage,
        total,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }

  mapInfinite<T, C = any>(payload: unknown): InfiniteResponse<T, C> {
    const items = this.getByPath(payload, this.config.infiniteItemsPath ?? 'items') ?? [];

    let nextCursor = this.getByPath(payload, this.config.infiniteNextCursorPath ?? 'nextCursor') as
      | C
      | undefined;
    let previousCursor = this.getByPath(
      payload,
      this.config.infinitePrevCursorPath ?? 'previousCursor',
    ) as C | undefined;

    // Apply cursor transformer
    if (this.config.transformCursor && nextCursor !== undefined) {
      nextCursor = this.config.transformCursor(nextCursor);
    }
    if (this.config.transformCursor && previousCursor !== undefined) {
      previousCursor = this.config.transformCursor(previousCursor);
    }

    const hasNextPage = this.config.infiniteHasNextPath
      ? (this.getByPath(payload, this.config.infiniteHasNextPath) as boolean)
      : !!nextCursor;

    const hasPreviousPage = this.config.infiniteHasPrevPath
      ? (this.getByPath(payload, this.config.infiniteHasPrevPath) as boolean)
      : !!previousCursor;

    return {
      items: Array.isArray(items) ? (items as T[]) : [],
      nextCursor,
      previousCursor,
      meta: { hasNextPage, hasPreviousPage },
    };
  }

  private getByPath(obj: unknown, path: string): unknown {
    if (!path) return undefined;
    return path.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }
}
