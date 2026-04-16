import xior, {
  isXiorError,
  type XiorInstance,
  type XiorInterceptorRequestConfig,
  type XiorRequestConfig,
} from 'xior';
import errorRetryPlugin from 'xior/plugins/error-retry';

import { SDKException } from '../core/exception.ts';

export type AuthInterceptor = (
  config: XiorInterceptorRequestConfig,
) => Promise<XiorInterceptorRequestConfig> | XiorInterceptorRequestConfig;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequest {
  path: string[];
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface HttpClientConfig {
  timeout?: number;
  headers?: Record<string, string>;
  retryTimes?: number;
  authInterceptor?: AuthInterceptor;
}

export class HttpClient {
  private readonly httpClient: XiorInstance;

  constructor(baseURL: string, config: HttpClientConfig = {}) {
    this.httpClient = xior.create({
      baseURL,
      timeout: config.timeout ?? 10_000,
      headers: config.headers,
    });

    this.httpClient.plugins.use(
      errorRetryPlugin({
        retryTimes: config.retryTimes ?? 3,
        retryInterval: 1000,
        onRetry: (_config, error) => {
          const status = error.response?.status;
          return status === 429 || (!!status && status >= 500 && status !== 401);
        },
      }),
    );

    if (config.authInterceptor) {
      this.httpClient.interceptors.request.use(config.authInterceptor);
    }
  }

  private buildRequest(method: HttpMethod, req: ApiRequest): XiorRequestConfig {
    return {
      method,
      url: `/${req.path.filter(Boolean).join('/')}`,
      headers: req.headers,
      params: req.query,
      data: req.body,
      ...(req.timeout != null && { timeout: req.timeout }),
    };
  }

  private async request<T>(method: HttpMethod, req: ApiRequest): Promise<T> {
    try {
      const res = await this.httpClient.request<T>(this.buildRequest(method, req));
      return res.data;
    } catch (err) {
      if (isXiorError(err)) throw SDKException.fromXiorError(err);
      if (err instanceof SDKException) throw err;
      throw err;
    }
  }

  get<T = unknown>(req: ApiRequest): Promise<T> {
    return this.request<T>('GET', req);
  }

  post<T = unknown>(req: ApiRequest): Promise<T> {
    return this.request<T>('POST', req);
  }

  put<T = unknown>(req: ApiRequest): Promise<T> {
    return this.request<T>('PUT', req);
  }

  patch<T = unknown>(req: ApiRequest): Promise<T> {
    return this.request<T>('PATCH', req);
  }

  delete<T = unknown>(req: ApiRequest): Promise<T> {
    return this.request<T>('DELETE', req);
  }
}
