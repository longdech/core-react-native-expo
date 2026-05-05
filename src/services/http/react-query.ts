import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

/**
 * Default QueryClient config:
 * - staleTime 1 phút để giảm request lặp
 * - tắt refetch khi focus lại tab để tránh flicker
 */
const defaultConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },

    mutations: {
      retry: 0,
    },
  },
};

/**
 * Create QueryClient với config có thể override
 */
export function createQueryClient(config?: QueryClientConfig): QueryClient {
  return new QueryClient({
    ...defaultConfig,
    ...config,
    defaultOptions: {
      queries: {
        ...defaultConfig.defaultOptions?.queries,
        ...config?.defaultOptions?.queries,
      },
      mutations: {
        ...defaultConfig.defaultOptions?.mutations,
        ...config?.defaultOptions?.mutations,
      },
    },
  });
}

/**
 * Shared QueryClient instance cho app
 */
export const queryClient = createQueryClient();
