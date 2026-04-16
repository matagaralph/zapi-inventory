export interface PageContext {
  page: number;
  per_page: number;
  has_more_page: boolean;
}

export type BaseResponse<T = unknown> = {
  code: number;
  message: string;
} & T;

export type PaginatedResponse<T = unknown> = BaseResponse<T> & {
  page_context?: PageContext;
};
