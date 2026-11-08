import type {
  BulkConfirmSalesordersResponse,
  BulkConfirmSalesOrdersQuery,
  BulkSubmitSalesordersQuery,
  BulkApproveSalesordersQuery,
  CreateSalesOrderRequest,
  CreateSalesOrderQuery,
  CreateSalesOrderResponse,
  GetSalesOrderResponse,
  ListSalesOrdersQuery,
  ListSalesOrdersResponse,
  SalesordersRejectRequest,
  UpdateSalesOrderRequest,
  UpdateSalesOrderQuery,
  UpdateSalesOrderResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'
import type { PartialBy } from '../utils.ts'

export type ListSalesOrdersParams = ListSalesOrdersQuery & {
  sort_column?: string
  sort_order?: 'A' | 'D'
  salesorder_number_contains?: string
  reference_number_contains?: string
  customer_id?: string
  created_date_start?: string
  created_date_end?: string
  shipment_date_start?: string
  shipment_date_end?: string
  status?: string
  location_ids?: string
  shipping_attention_contains?: string
  line_item_location_id?: string
  item_id?: string
}

/**
 * A sales order is a financial document that confirms an impending sale. It details the exact quantity, price and delivery details of the products or services being sold. Perform the simple operations mentioned below to create and manage your Sales Orders.
 */
export function createSalesOrders(http: HTTPClient) {
  return {
    async list(params?: ListSalesOrdersParams): Promise<ListSalesOrdersResponse['salesorders']> {
      const { salesorders } = await http.get<ListSalesOrdersResponse>({
        path: ['salesorders'],
        query: params,
      })
      return salesorders
    },

    // salesorder_number is only mandatory when params.ignore_auto_number_generation is true.
    // Otherwise Zoho auto-generates it. Zoho's spec always marks it required, so it's relaxed here.
    async create(
      data: PartialBy<CreateSalesOrderRequest, 'salesorder_number'>,
      params?: CreateSalesOrderQuery
    ): Promise<CreateSalesOrderResponse['salesorder']> {
      const { salesorder } = await http.post<CreateSalesOrderResponse>({
        path: ['salesorders'],
        query: params,
        body: data,
      })
      return salesorder
    },

    async bulkDelete(): Promise<void> {
      await http.delete({ path: ['salesorders'] })
    },

    async get(salesorderId: string): Promise<GetSalesOrderResponse['salesorder']> {
      const { salesorder } = await http.get<GetSalesOrderResponse>({
        path: ['salesorders', salesorderId],
      })
      return salesorder
    },

    async update(
      salesorderId: string,
      data: PartialBy<UpdateSalesOrderRequest, 'salesorder_number'>,
      params?: UpdateSalesOrderQuery
    ): Promise<UpdateSalesOrderResponse['salesorder']> {
      const { salesorder } = await http.put<UpdateSalesOrderResponse>({
        path: ['salesorders', salesorderId],
        query: params,
        body: data,
      })
      return salesorder
    },

    async delete(salesorderId: string): Promise<void> {
      await http.delete({ path: ['salesorders', salesorderId] })
    },

    async markAsConfirmed(salesorderId: string): Promise<void> {
      await http.post({
        path: ['salesorders', salesorderId, 'status', 'confirmed'],
      })
    },

    async markAsVoid(salesorderId: string): Promise<void> {
      await http.post({
        path: ['salesorders', salesorderId, 'status', 'void'],
      })
    },

    async bulkConfirm(
      params: BulkConfirmSalesOrdersQuery
    ): Promise<BulkConfirmSalesordersResponse> {
      return http.post<BulkConfirmSalesordersResponse>({
        path: ['salesorders', 'status', 'confirmed'],
        query: params,
      })
    },

    async submit(salesorderId: string): Promise<void> {
      await http.post({
        path: ['salesorders', salesorderId, 'submit'],
      })
    },

    async approve(salesorderId: string): Promise<void> {
      await http.post({
        path: ['salesorders', salesorderId, 'approve'],
      })
    },

    async approveFinal(salesorderId: string): Promise<void> {
      await http.post({
        path: ['salesorders', salesorderId, 'approve', 'final'],
      })
    },

    async reject(salesorderId: string, data?: SalesordersRejectRequest): Promise<void> {
      await http.post({
        path: ['salesorders', salesorderId, 'reject'],
        body: data,
      })
    },

    async bulkSubmit(params: BulkSubmitSalesordersQuery): Promise<void> {
      await http.post({
        path: ['salesorders', 'submit'],
        query: params,
      })
    },

    async bulkApprove(params: BulkApproveSalesordersQuery): Promise<void> {
      await http.post({
        path: ['salesorders', 'approve'],
        query: params,
      })
    },
  }
}

export type SalesOrders = ReturnType<typeof createSalesOrders>
