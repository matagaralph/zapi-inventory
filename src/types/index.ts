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

export interface PackageDetails {
  length: string;
  width: string;
  height: string;
  weight: number | string;
  weight_unit: string;
  dimension_unit: string;
}
