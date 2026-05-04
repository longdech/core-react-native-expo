// service-provider.ts
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query"

import { HttpClient, type HttpQueryParamValue, type HttpQueryParams } from "./http-client"
import {
  type Id,
  type InfiniteResponse,
  type MaybeApiResponse,
  type Page,
  type ListResponse,
  unwrapApiResponse,
  type BackendType,
  type MappingConfig,
} from "./types"
import { ResponseMapper } from "./response-mapper"

interface QueryKeys<Params extends Record<string, unknown>> {
  list: (params?: Params) => readonly unknown[]
  lists: () => readonly unknown[]
  infinite: (params?: Params) => readonly unknown[]
  detail: (id: Id) => readonly unknown[]
}

interface ServiceProviderOptions<T, C extends Page> {
  pageParamKey?: string
  mapInfiniteResponse?: (payload: unknown) => InfiniteResponse<T, C>
  getNextPageParam?: (lastPage: InfiniteResponse<T, C>) => C | undefined
  getPreviousPageParam?: (firstPage: InfiniteResponse<T, C>) => C | undefined
  mapListResponse?: (payload: unknown) => ListResponse<T>

  // Backend configuration
  backend?: BackendType
  customMapping?: MappingConfig
}

interface InfiniteMapperConfig<T, C extends Page> {
  itemsPath?: string
  nextPagePath?: string
  getNextPage?: (payload: unknown) => C | undefined
}

const getByPath = (input: unknown, path: string): unknown => {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }

    return undefined
  }, input)
}

/**
 * Helper map payload backend bất kỳ về InfiniteResponse.
 * Dùng path dạng "data.items", "meta.nextPage", ...
 */
export function createInfiniteResponseMapper<T, C extends Page = Page>(
  config: InfiniteMapperConfig<T, C> = {}
) {
  const itemsPath = config.itemsPath ?? "items"
  const nextPagePath = config.nextPagePath ?? "nextPage"

  return (payload: unknown): InfiniteResponse<T, C> => {
    const unwrapped = unwrapApiResponse(payload as MaybeApiResponse<unknown>)
    const isEnveloped = unwrapped !== payload

    const mappedItems =
      getByPath(unwrapped, itemsPath) ?? (isEnveloped ? getByPath(payload, itemsPath) : undefined)

    const mappedNextPage = config.getNextPage
      ? config.getNextPage(payload)
      : ((getByPath(unwrapped, nextPagePath) ??
          (isEnveloped ? getByPath(payload, nextPagePath) : undefined)) as C | undefined)

    return {
      items: Array.isArray(mappedItems) ? (mappedItems as T[]) : [],
      nextCursor: mappedNextPage,
      previousCursor: undefined,
      meta: { hasNextPage: !!mappedNextPage, hasPreviousPage: false },
    }
  }
}

// ============ GLOBAL BACKEND CONFIG ============

/**
 * Default backend for response mapping when no config provided
 */
const DEFAULT_BACKEND: BackendType = "nestjs"

let globalBackendConfig: {
  backend?: BackendType
  customMapping?: MappingConfig
} = {
  backend: DEFAULT_BACKEND,
}

/**
 * Set global backend configuration for all services
 * @example
 * setGlobalBackendConfig({ backend: "laravel" })
 * setGlobalBackendConfig({ customMapping: { listDataPath: "items" } })
 */
export function setGlobalBackendConfig(config: {
  backend?: BackendType
  customMapping?: MappingConfig
}) {
  globalBackendConfig = { ...globalBackendConfig, ...config }
}

/**
 * Get current global backend config
 */
export function getGlobalBackendConfig() {
  return { ...globalBackendConfig }
}

// ============ CREATE SERVICE PROVIDER ============

/**
 * Factory tạo API layer + React Query hooks cho resource CRUD.
 * @param client - HTTP client instance
 * @param globalOptions - Global backend configuration for all services
 */
export function createServiceProvider(
  client: HttpClient,
  globalOptions?: { backend?: BackendType; customMapping?: MappingConfig }
) {
  // Merge global configs
  const finalGlobalConfig = { ...globalBackendConfig, ...globalOptions }

  const toRequestParams = (params?: Record<string, unknown>): HttpQueryParams | undefined =>
    params as HttpQueryParams | undefined

  return function defineService<
    T extends { id: Id },
    Params extends Record<string, unknown> = {},
    C extends Page = Page,
  >(baseUrl: string, keys: QueryKeys<Params>, options?: ServiceProviderOptions<T, C>) {
    const pageParamKey = options?.pageParamKey ?? "page"

    // Determine mapper config priority: options > global > default
    let mapperConfig: MappingConfig | BackendType | null = null

    if (options?.customMapping) {
      mapperConfig = options.customMapping
    } else if (options?.backend) {
      mapperConfig = options.backend
    } else if (finalGlobalConfig.customMapping) {
      mapperConfig = finalGlobalConfig.customMapping
    } else if (finalGlobalConfig.backend) {
      mapperConfig = finalGlobalConfig.backend
    } else {
      mapperConfig = DEFAULT_BACKEND
    }

    // Create response mapper
    const responseMapper = new ResponseMapper(mapperConfig)

    const mapInfiniteResponse =
      options?.mapInfiniteResponse ??
      ((payload: unknown) => {
        return responseMapper.mapInfinite<T, C>(payload)
      })

    const getNextPageParam =
      options?.getNextPageParam ??
      ((lastPage: InfiniteResponse<T, C>) => lastPage.nextCursor ?? undefined)

    const api = {
      list: (params?: Params): Promise<ListResponse<T>> => {
        const requestPromise = client.get<unknown>(baseUrl, toRequestParams(params))

        if (options?.mapListResponse) {
          return requestPromise.then(options.mapListResponse)
        }

        // Use responseMapper by default
        return requestPromise.then((payload) => responseMapper.mapList<T>(payload))
      },

      infinite: (params?: Params, page?: C) =>
        client.get<MaybeApiResponse<InfiniteResponse<T, C>>>(baseUrl, {
          ...toRequestParams(params),
          [pageParamKey]: page as HttpQueryParamValue,
        }),

      detail: (id: Id) => client.get<T>(`${baseUrl}/${id}`),

      create: (data: Partial<T>) => client.post<T>(baseUrl, data),

      update: (id: Id, data: Partial<T>) => client.put<T>(`${baseUrl}/${id}`, data),

      remove: (id: Id) => client.delete<void>(`${baseUrl}/${id}`),
    }

    const hooks = {
      useList(
        params?: Params,
        options?: Omit<UseQueryOptions<ListResponse<T>, Error>, "queryKey" | "queryFn">
      ) {
        return useQuery({
          queryKey: keys.list(params),
          queryFn: () => api.list(params),
          ...options,
        })
      },

      useInfinite(
        params?: Params,
        options?: Omit<
          UseInfiniteQueryOptions<
            InfiniteResponse<T, C>,
            Error,
            InfiniteResponse<T, C>,
            ReturnType<typeof keys.infinite>,
            C | undefined
          >,
          "queryKey" | "queryFn" | "initialPageParam"
        >
      ): UseInfiniteQueryResult<InfiniteResponse<T, C>, Error> & {
        data: { pages: InfiniteResponse<T, C>[]; pageParams: C[] } | undefined
      } {
        const result = useInfiniteQuery({
          queryKey: keys.infinite(params),

          queryFn: async ({ pageParam }) => {
            const payload = await api.infinite(params, pageParam as C | undefined)
            return mapInfiniteResponse(payload)
          },

          initialPageParam: undefined as C | undefined,

          getNextPageParam,
          getPreviousPageParam: options?.getPreviousPageParam,

          ...options,
        })

        return result as UseInfiniteQueryResult<InfiniteResponse<T, C>, Error> & {
          data: { pages: InfiniteResponse<T, C>[]; pageParams: C[] } | undefined
        }
      },

      useDetail(id: Id, options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">) {
        return useQuery({
          queryKey: keys.detail(id),
          queryFn: () => api.detail(id),
          enabled: id !== undefined && id !== null,
          ...options,
        })
      },

      useCreate() {
        const qc = useQueryClient()

        return useMutation({
          mutationFn: api.create,

          onSuccess: () => {
            qc.invalidateQueries({
              queryKey: keys.lists(),
            })
          },
        })
      },

      useUpdate() {
        const qc = useQueryClient()

        return useMutation({
          mutationFn: ({ id, data }: { id: Id; data: Partial<T> }) => api.update(id, data),

          onSuccess: (_, vars) => {
            qc.invalidateQueries({
              queryKey: keys.detail(vars.id),
            })

            qc.invalidateQueries({
              queryKey: keys.lists(),
            })
          },
        })
      },

      useDelete() {
        const qc = useQueryClient()

        return useMutation({
          mutationFn: api.remove,

          onSuccess: (_, id) => {
            qc.invalidateQueries({
              queryKey: keys.lists(),
            })

            qc.removeQueries({
              queryKey: keys.detail(id),
            })
          },
        })
      },
    }

    return { api, hooks }
  }
}
