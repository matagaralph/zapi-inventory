export interface ZohoPageContext {
  page: number;
  per_page: number;
  has_more_page: boolean;
}

export interface ZohoBulkEntry {
  code: number;
  message: string;
}

export interface ZohoApiBase {
  code: number;
  message: string;
  page_context?: ZohoPageContext;
}

export type ZohoApiResponse<TResponse> = ZohoApiBase &
  TResponse & {
    [key: string]: ZohoBulkEntry[] | unknown;
  };

type DataCenter =
  | '.com'
  | '.eu'
  | '.in'
  | '.com.au'
  | '.jp'
  | '.ca'
  | '.com.cn'
  | '.sa';

export type ServiceConfig = {
  orgId: string;
  refreshToken: string;
  dc: DataCenter;
  client: {
    id: string;
    secret: string;
  };
  /**
   * Optional request timeout in milliseconds. Defaults to 30000.
   */
  timeout?: number;
};

export type ServiceRequest = {
  path: string[];
  /**
   * URL Parameters
   */
  params?: Record<string, string | number | boolean>;

  body?: unknown;

  headers?: Record<string, string | number | boolean>;

  /**
   * Retry the request a number of times while backing off exponentially.
   */
  retry?: number;

  /**
   * Timeout for the request in milliseconds.
   * @default 7000
   */
  timeout?: number;

  /**
   * Override the base URL for this specific request (rarely needed).
   */
  baseUrl?: string;
};
