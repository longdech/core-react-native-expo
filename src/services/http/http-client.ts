import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from 'axios';

import { TokenManager } from './token-manager';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type HttpQueryParamValue = string | number | boolean | undefined;
export type HttpQueryParams = Record<string, HttpQueryParamValue>;

export interface HttpRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  params?: HttpQueryParams;
  signal?: AbortSignal;
  skipDeduplication?: boolean;
}

export interface LocaleAttacher {
  attachLocaleToRequest(request: InternalAxiosRequestConfig): Promise<void> | void;
}

export interface TokenAttacher {
  attachTokenToRequest(request: InternalAxiosRequestConfig): Promise<void> | void;
}

export interface DomainAttacher {
  attachDomainToRequest(request: InternalAxiosRequestConfig): Promise<void> | void;
}

export interface HttpClientConfig extends CreateAxiosDefaults {
  baseURL: string;
  getToken?: () => Promise<string | null> | string | null;
  tokenManager?: TokenManager;
  enableDeduplication?: boolean;
  onError?: (error: AxiosError) => void;
}

export type InterceptorsConfig = {
  onRequest?: (
    request: InternalAxiosRequestConfig,
  ) => Promise<InternalAxiosRequestConfig> | InternalAxiosRequestConfig;
  onRequestError?: (error: AxiosError) => Promise<never>;
  onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onResponseError?: (error: AxiosError) => Promise<never>;
};

/**
 * Axios-based HTTP client with overridable request enrichers.
 */
export class HttpClient implements LocaleAttacher, TokenAttacher, DomainAttacher {
  protected instance: ReturnType<typeof axios.create>;
  private readonly getTokenFromConfig?: HttpClientConfig['getToken'];
  protected readonly tokenManager?: TokenManager;
  private requestInterceptorId: number | null = null;
  private responseInterceptorId: number | null = null;
  private readonly enableDeduplication: boolean;
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private readonly onError?: (error: AxiosError) => void;

  constructor(config: HttpClientConfig) {
    const { getToken, tokenManager, enableDeduplication = true, onError, ...axiosConfig } = config;

    this.getTokenFromConfig = getToken;
    this.tokenManager = tokenManager;
    this.enableDeduplication = enableDeduplication;
    this.onError = onError;
    this.instance = axios.create(axiosConfig);
    this.setupInterceptors();
  }

  protected onRequest = async (request: InternalAxiosRequestConfig) => {
    await this.attachTokenToRequest(request);
    await this.attachLocaleToRequest(request);
    await this.attachDomainToRequest(request);
    return request;
  };

  protected onRequestError = (error: AxiosError) => {
    this.onError?.(error);
    return Promise.reject(error);
  };

  protected onResponse = (response: AxiosResponse) => response;

  protected onResponseError = (error: AxiosError) => {
    this.onError?.(error);
    return Promise.reject(error);
  };

  setupInterceptors({
    onRequest = this.onRequest,
    onRequestError = this.onRequestError,
    onResponse = this.onResponse,
    onResponseError = this.onResponseError,
  }: InterceptorsConfig = {}) {
    if (this.requestInterceptorId !== null) {
      this.instance.interceptors.request.eject(this.requestInterceptorId);
    }

    if (this.responseInterceptorId !== null) {
      this.instance.interceptors.response.eject(this.responseInterceptorId);
    }

    this.requestInterceptorId = this.instance.interceptors.request.use(onRequest, onRequestError);
    this.responseInterceptorId = this.instance.interceptors.response.use(
      onResponse,
      onResponseError,
    );
  }

  async attachLocaleToRequest(_request: InternalAxiosRequestConfig) {}

  async attachDomainToRequest(_request: InternalAxiosRequestConfig) {}

  async attachTokenToRequest(request: InternalAxiosRequestConfig) {
    const token =
      (await this.tokenManager?.getToken()) ?? (await this.getTokenFromConfig?.()) ?? null;

    if (!token) return;

    request.headers = request.headers ?? {};
    request.headers.Authorization = `Bearer ${token}`;
  }

  private getRequestKey(url: string, options: HttpRequestOptions): string {
    return JSON.stringify({
      url,
      method: options.method || 'GET',
      params: options.params,
      body: options.body,
    });
  }

  async request<TResponse, TBody = unknown>(
    url: string,
    options: HttpRequestOptions<TBody> = {},
  ): Promise<TResponse> {
    const { method = 'GET', body, headers, params, signal, skipDeduplication = false } = options;

    const requestConfig = {
      method,
      url,
      data: body,
      headers,
      params,
      signal,
    };

    // Request deduplication
    if (this.enableDeduplication && !skipDeduplication && method === 'GET') {
      const key = this.getRequestKey(url, options);

      if (this.pendingRequests.has(key)) {
        return this.pendingRequests.get(key) as Promise<TResponse>;
      }

      const promise = this.instance
        .request<TResponse, AxiosResponse<TResponse>, TBody>(requestConfig)
        .then((response) => response.data)
        .finally(() => {
          this.pendingRequests.delete(key);
        });

      this.pendingRequests.set(key, promise);
      return promise;
    }

    const response = await this.instance.request<TResponse, AxiosResponse<TResponse>, TBody>(
      requestConfig,
    );
    return response.data;
  }

  get<T>(url: string, params?: HttpQueryParams, options?: Omit<HttpRequestOptions, 'params'>) {
    return this.request<T>(url, { ...options, params });
  }

  post<T, B = unknown>(url: string, body?: B, options?: Omit<HttpRequestOptions<B>, 'body'>) {
    return this.request<T, B>(url, { ...options, method: 'POST', body });
  }

  put<T, B = unknown>(url: string, body?: B, options?: Omit<HttpRequestOptions<B>, 'body'>) {
    return this.request<T, B>(url, { ...options, method: 'PUT', body });
  }

  patch<T, B = unknown>(url: string, body?: B, options?: Omit<HttpRequestOptions<B>, 'body'>) {
    return this.request<T, B>(url, { ...options, method: 'PATCH', body });
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T, AxiosResponse<T>>(url, config).then((r) => r.data);
  }
}
