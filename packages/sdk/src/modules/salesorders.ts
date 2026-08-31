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

export class SalesOrders {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListSalesOrdersParams): Promise<ListSalesOrdersResponse['salesorders']> {
    const { salesorders } = await this.http.get<ListSalesOrdersResponse>({
      path: ['salesorders'],
      query: params,
    })
    return salesorders
  }

  // salesorder_number is only mandatory when params.ignore_auto_number_generation is true;
  // otherwise Zoho auto-generates it. Zoho's spec always marks it required, so it's relaxed here.
  async create(
    data: PartialBy<CreateSalesOrderRequest, 'salesorder_number'>,
    params?: CreateSalesOrderQuery
  ): Promise<CreateSalesOrderResponse['sales_order']> {
    const { sales_order } = await this.http.post<CreateSalesOrderResponse>({
      path: ['salesorders'],
      query: params,
      body: data,
    })
    return sales_order
  }

  async bulkDelete(): Promise<void> {
    await this.http.delete({ path: ['salesorders'] })
  }

  async get(salesorderId: string): Promise<GetSalesOrderResponse['salesorder']> {
    const { salesorder } = await this.http.get<GetSalesOrderResponse>({
      path: ['salesorders', salesorderId],
    })
    return salesorder
  }

  async update(
    salesorderId: string,
    data: PartialBy<UpdateSalesOrderRequest, 'salesorder_number'>,
    params?: UpdateSalesOrderQuery
  ): Promise<UpdateSalesOrderResponse['sales_order']> {
    const { sales_order } = await this.http.put<UpdateSalesOrderResponse>({
      path: ['salesorders', salesorderId],
      query: params,
      body: data,
    })
    return sales_order
  }

  async delete(salesorderId: string): Promise<void> {
    await this.http.delete({ path: ['salesorders', salesorderId] })
  }

  async markAsConfirmed(salesorderId: string): Promise<void> {
    await this.http.post({
      path: ['salesorders', salesorderId, 'status', 'confirmed'],
    })
  }

  async markAsVoid(salesorderId: string): Promise<void> {
    await this.http.post({
      path: ['salesorders', salesorderId, 'status', 'void'],
    })
  }

  async bulkConfirm(params: BulkConfirmSalesOrdersQuery): Promise<BulkConfirmSalesordersResponse> {
    return this.http.post<BulkConfirmSalesordersResponse>({
      path: ['salesorders', 'status', 'confirmed'],
      query: params,
    })
  }

  async submit(salesorderId: string): Promise<void> {
    await this.http.post({
      path: ['salesorders', salesorderId, 'submit'],
    })
  }

  async approve(salesorderId: string): Promise<void> {
    await this.http.post({
      path: ['salesorders', salesorderId, 'approve'],
    })
  }

  async approveFinal(salesorderId: string): Promise<void> {
    await this.http.post({
      path: ['salesorders', salesorderId, 'approve', 'final'],
    })
  }

  async reject(salesorderId: string, data?: SalesordersRejectRequest): Promise<void> {
    await this.http.post({
      path: ['salesorders', salesorderId, 'reject'],
      body: data,
    })
  }

  async bulkSubmit(params: BulkSubmitSalesordersQuery): Promise<void> {
    await this.http.post({
      path: ['salesorders', 'submit'],
      query: params,
    })
  }

  async bulkApprove(params: BulkApproveSalesordersQuery): Promise<void> {
    await this.http.post({
      path: ['salesorders', 'approve'],
      query: params,
    })
  }
}
