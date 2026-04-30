export { type Contact, type ListContact } from './contact';
export { type ContactPerson, type ListContactPerson } from './contactperson';
export { type CustomField } from './customfield';
export {
  type Batch,
  type Item,
  type ItemCategory,
  type InventorySummary,
  type SalesOrderTransaction,
  type ListItem,
} from './item';
export { type SalesOrder, type ListSalesOrder } from './salesorder';
export { type ShipmentOrder } from './shipmentorder';

export interface PageContext {
  page: number;
  per_page: number;
  has_more_page: boolean;
}

type BaseResponse<T = unknown> = {
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
