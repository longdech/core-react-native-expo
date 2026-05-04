// types.ts
/**
 * Shared primitive id type used across resources.
 */
export type Id = string | number

/**
 * Standard API envelope used by many backends.
 */
export interface ApiResponse<TData> {
  data: TData
  success?: boolean
  message?: string
}

/**
 * Some endpoints return raw payload, others wrap into ApiResponse.
 */
export type MaybeApiResponse<TData> = TData | ApiResponse<TData>

/**
 * Page used for infinite pagination.
 */
export type Page = string | number | null | undefined

/**
 * Pagination metadata for list response
 */
export interface PaginationMeta {
  currentPage: number
  perPage: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Standard list response with metadata
 */
export interface ListResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * Cursor metadata for infinite response
 */
export interface CursorMeta {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
  [key: string]: unknown
}

/**
 * Standard shape for infinite list responses with 2-way pagination
 */
export interface InfiniteResponse<T, C = Page> {
  items: T[]
  nextCursor?: C
  previousCursor?: C
  meta?: CursorMeta
}

/**
 * Backend types supported
 */
export type BackendType = "laravel" | "graphql" | "nestjs" | "java" | "dotnet" | "custom"

/**
 * Mapping configuration for response mapper
 */
export interface MappingConfig {
  // List response mapping
  listDataPath?: string
  listTotalPath?: string
  listPagePath?: string
  listLimitPath?: string
  listTotalPagesPath?: string

  // Infinite response mapping
  infiniteItemsPath?: string
  infiniteNextCursorPath?: string
  infinitePrevCursorPath?: string
  infiniteHasNextPath?: string
  infiniteHasPrevPath?: string

  // Transformers
  transformPage?: (page: number) => number
  transformCursor?: (cursor: any) => any
}

export function isApiResponse<TData>(
  payload: MaybeApiResponse<TData>
): payload is ApiResponse<TData> {
  return typeof payload === "object" && payload !== null && "data" in payload
}

const ENVELOPE_KEYS = ["data", "result", "payload", "response"] as const

export function unwrapApiResponse<TData>(payload: MaybeApiResponse<TData>): TData {
  if (typeof payload !== "object" || payload === null) return payload as TData

  for (const key of ENVELOPE_KEYS) {
    if (key in payload) return (payload as Record<string, TData>)[key]
  }

  return payload as TData
}

/**
 * Helper để unwrap custom response structure
 */
export function createResponseUnwrapper<TData>(dataKey: string) {
  return (payload: unknown): TData => {
    if (typeof payload === "object" && payload !== null && dataKey in payload) {
      return (payload as Record<string, TData>)[dataKey]
    }
    return payload as TData
  }
}

/**
 * Type guard để kiểm tra response có phải error không
 */
export interface ApiError {
  error: string
  message: string
  statusCode: number
}

export function isApiError(payload: unknown): payload is ApiError {
  return (
    typeof payload === "object" && payload !== null && "error" in payload && "message" in payload
  )
}
