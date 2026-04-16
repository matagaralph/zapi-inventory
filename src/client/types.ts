export interface ApiRequestContext {
  path: string[];
  params?: Record<string, string | number | boolean>;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}
