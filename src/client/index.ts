import xior, {
  type XiorError,
  type XiorInstance,
  type XiorRequestConfig,
} from 'xior';
import errorRetryPlugin from 'xior/plugins/error-retry';
import {
  type ServiceRequest,
  type ServiceConfig,
  type ZohoApiResponse,
} from './types';
import { rateLimitPlugin } from '../utils/retry';

export class ZohoApiError extends Error {
  url?: string;
  code?: number;

  constructor(err: XiorError<{ code: number; message: string }>) {
    super(err.response?.data.message ?? err.message);
    this.url = (err.config?.baseURL ?? '') + (err.config?.url ?? '');
    this.code = err.response?.data.code;
    Object.setPrototypeOf(this, ZohoApiError.prototype);
  }
}

export class ApiClient {
  private httpClient: XiorInstance;
  private config: ServiceConfig;
  private accessToken: string = '';
  private tokenExpiresAt: number = 0;
  private refreshPromise: Promise<string> | null = null;
  private readonly baseURL: string;

  constructor(config: ServiceConfig) {
    this.config = config;
    this.baseURL = `https://www.zohoapis${this.config.dc}/inventory/v1`;
    this.httpClient = this.createHttpClient();
  }

  private createHttpClient(): XiorInstance {
    const client = xior.create({
      baseURL: this.baseURL,
      params: {
        organization_id: this.config.orgId,
      },
      timeout: this.config.timeout ?? 30_000,
    });

    client.plugins.use(rateLimitPlugin(2, 334));

    client.plugins.use(
      errorRetryPlugin({
        retryTimes: 3,
        retryInterval: 1000,
        onRetry: (config, error) => {
          const status = error.response?.status;
          return status === 429 || (!!status && status >= 500);
        },
      })
    );

    client.interceptors.request.use(async (requestConfig) => {
      const token = await this.getAccessToken();

      if (!requestConfig.headers) requestConfig.headers = {};
      if (!requestConfig.params) requestConfig.params = {};
      if (!requestConfig.params.organization_id) {
        requestConfig.params.organization_id = this.config.orgId;
      }

      requestConfig.headers.Authorization = `Zoho-oauthtoken ${token}`;
      return requestConfig;
    });

    return client;
  }

  private async getAccessToken(): Promise<string> {
    const bufferMs = 5 * 60 * 1000;
    if (this.accessToken && Date.now() < this.tokenExpiresAt - bufferMs) {
      return this.accessToken;
    }

    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = this.refreshAccessToken();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async refreshAccessToken(): Promise<string> {
    const params = new URLSearchParams({
      refresh_token: this.config.refreshToken,
      client_id: this.config.client.id,
      client_secret: this.config.client.secret,
      grant_type: 'refresh_token',
    });

    try {
      const response = await xior.post(
        `https://accounts.zoho${this.config.dc}/oauth/v2/token`,
        params,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 30_000,
        }
      );

      const { access_token, expires_in } = response.data;
      this.accessToken = access_token;
      this.tokenExpiresAt = Date.now() + expires_in * 1000;

      return access_token;
    } catch (error: any) {
      throw new Error(
        `Zoho OAuth Failed: ${
          error.response?.data?.error_description || error.message
        }`
      );
    }
  }

  private async request<TResponse>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    req: ServiceRequest
  ): Promise<ZohoApiResponse<TResponse>> {
    const xiorRequest: XiorRequestConfig = {
      method,
      url: `/${req.path.join('/')}`,
      headers: req.headers ?? {},
      params: req.params,
    };

    if (req.baseUrl) xiorRequest.baseURL = req.baseUrl;
    if (req.timeout) xiorRequest.timeout = req.timeout;

    if (req.body) {
      if (typeof req.body === 'string') {
        xiorRequest.data = req.body;
      } else {
        xiorRequest.data = req.body;
        if (!xiorRequest.headers) xiorRequest.headers = {};
        xiorRequest.headers['Content-Type'] = 'application/json;charset=UTF-8';
      }
    }

    const res = await this.httpClient
      .request<ZohoApiResponse<TResponse>>(xiorRequest)
      .catch((err) => {
        throw new ZohoApiError(err);
      });

    const responseData = res.data;

    if (responseData.code !== undefined && responseData.code !== 0) {
      throw new ZohoApiError({
        response: { data: responseData },
        config: xiorRequest,
        message: responseData.message,
      } as XiorError<any>);
    }

    return responseData;
  }

  public async get<TResponse>(
    req: ServiceRequest
  ): Promise<ZohoApiResponse<TResponse>> {
    return this.request<TResponse>('GET', req);
  }

  public async post<TResponse>(
    req: ServiceRequest
  ): Promise<ZohoApiResponse<TResponse>> {
    return this.request<TResponse>('POST', req);
  }

  public async put<TResponse>(
    req: ServiceRequest
  ): Promise<ZohoApiResponse<TResponse>> {
    return this.request<TResponse>('PUT', req);
  }

  public async delete<TResponse>(
    req: ServiceRequest
  ): Promise<ZohoApiResponse<TResponse>> {
    return this.request<TResponse>('DELETE', req);
  }

  public async getList<TResponse, TItem>(
    opts: ServiceRequest & {
      limit?: number;
      extractor: (res: TResponse) => TItem[];
    }
  ): Promise<TItem[]> {
    const limit = opts.limit ?? Infinity;
    const out: TItem[] = [];
    let page = 1;
    let hasMore = true;

    const baseParams = opts.params ?? {};

    while (hasMore && out.length < limit) {
      const remaining = limit - out.length;
      const requestParams: Record<string, any> = { ...baseParams, page };

      if (remaining < 200) {
        requestParams.per_page = remaining;
      }

      const res = await this.get<TResponse>({
        ...opts,
        params: requestParams,
      });

      const items = opts.extractor(res) ?? [];
      if (items.length === 0) break;

      out.push(...items);

      // Safe cast: We assume runtime has page_context
      const context = (res as any).page_context;
      hasMore = !!context?.has_more_page;
      page = (context?.page ?? page) + 1;
    }

    return out;
  }
}
