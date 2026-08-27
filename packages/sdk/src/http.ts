import xior, {
  isXiorError,
  type XiorInstance,
  type XiorInterceptorRequestConfig,
  type XiorRequestConfig,
} from 'xior'
import errorRetryPlugin from 'xior/plugins/error-retry'
import { APIError } from './errors.ts'

export type AuthInterceptor = (
  config: XiorInterceptorRequestConfig
) => Promise<XiorInterceptorRequestConfig> | XiorInterceptorRequestConfig

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiRequest {
  path: string[]
  query?: Record<string, string | number | boolean | undefined>
  body?: unknown
  headers?: Record<string, string>
  timeout?: number
}

export interface HTTPClientOptions {
  timeout?: number
  headers?: Record<string, string>
  retryTimes?: number
  authInterceptor?: AuthInterceptor
}

function isRetryableStatus(status: number | undefined): boolean {
  return status === 429 || (status !== undefined && status >= 500)
}

function buildPath(segments: string[]): string {
  let path = ''
  for (const segment of segments) {
    if (segment) path += `/${segment}`
  }
  return path || '/'
}

export class HTTPClient {
  private readonly httpClient: XiorInstance

  constructor(baseURL: string, config: HTTPClientOptions = {}) {
    this.httpClient = xior.create({
      baseURL,
      timeout: config.timeout ?? 10_000,
      headers: config.headers,
    })

    this.httpClient.plugins.use(
      errorRetryPlugin({
        retryTimes: config.retryTimes ?? 3,
        retryInterval: 1000,
        onRetry: (_config, error) => isRetryableStatus(error.response?.status),
      })
    )

    if (config.authInterceptor) {
      this.httpClient.interceptors.request.use(config.authInterceptor)
    }
  }

  private async request<T>(method: HTTPMethod, req: ApiRequest): Promise<T> {
    // xior merges this on top of its own {} defaults without skipping undefined, so only set these when present.
    const config: XiorRequestConfig = {
      method,
      url: buildPath(req.path),
      ...(req.headers && { headers: req.headers }),
      ...(req.query && { params: req.query }),
      data: req.body,
      timeout: req.timeout,
    }

    try {
      const res = await this.httpClient.request<T>(config)
      return res.data
    } catch (err) {
      throw isXiorError(err) ? APIError.fromXiorError(err) : err
    }
  }

  get<T = unknown>(req: ApiRequest): Promise<T> {
    return this.request<T>('GET', req)
  }

  post<T = unknown>(req: ApiRequest): Promise<T> {
    return this.request<T>('POST', req)
  }

  put<T = unknown>(req: ApiRequest): Promise<T> {
    return this.request<T>('PUT', req)
  }

  patch<T = unknown>(req: ApiRequest): Promise<T> {
    return this.request<T>('PATCH', req)
  }

  delete<T = unknown>(req: ApiRequest): Promise<T> {
    return this.request<T>('DELETE', req)
  }
}
