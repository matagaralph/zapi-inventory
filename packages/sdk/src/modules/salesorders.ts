import type {
  BulkConfirmSalesordersResponse,
  BulkDeleteSalesOrdersResponse,
  CreateSalesOrderRequest,
  CreateSalesOrderResponse,
  GetSalesOrderResponse,
  ListSalesOrdersResponse,
  MarkAsConfirmedResponse,
  SalesordersApprovalActionResponse,
  SalesordersMarkAsVoidResponse,
  SalesordersRejectRequest,
  UpdateSalesOrderRequest,
  UpdateSalesOrderResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class SalesOrders {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListSalesOrdersResponse['salesorders']> {
    const { salesorders } = await this.http.get<ListSalesOrdersResponse>({
      path: ['salesorders'],
      query: params,
    })
    return salesorders
  }

  async create(
    data: CreateSalesOrderRequest,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<CreateSalesOrderResponse['sales_order']> {
    const { sales_order } = await this.http.post<CreateSalesOrderResponse>({
      path: ['salesorders'],
      query: params,
      body: data,
    })
    return sales_order
  }

  async bulkDelete(): Promise<BulkDeleteSalesOrdersResponse> {
    return this.http.delete<BulkDeleteSalesOrdersResponse>({ path: ['salesorders'] })
  }

  async get(salesorderId: string): Promise<GetSalesOrderResponse['salesorder']> {
    const { salesorder } = await this.http.get<GetSalesOrderResponse>({
      path: ['salesorders', salesorderId],
    })
    return salesorder
  }

  async update(
    salesorderId: string,
    data: UpdateSalesOrderRequest,
    params?: Record<string, string | number | boolean | undefined>
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

  async markAsConfirmed(salesorderId: string): Promise<MarkAsConfirmedResponse> {
    return this.http.post<MarkAsConfirmedResponse>({
      path: ['salesorders', salesorderId, 'status', 'confirmed'],
    })
  }

  async markAsVoid(salesorderId: string): Promise<SalesordersMarkAsVoidResponse> {
    return this.http.post<SalesordersMarkAsVoidResponse>({
      path: ['salesorders', salesorderId, 'status', 'void'],
    })
  }

  async bulkConfirm(salesorderIds: string): Promise<BulkConfirmSalesordersResponse> {
    return this.http.post<BulkConfirmSalesordersResponse>({
      path: ['salesorders', 'status', 'confirmed'],
      query: { salesorder_ids: salesorderIds },
    })
  }

  async submit(salesorderId: string): Promise<SalesordersApprovalActionResponse> {
    return this.http.post<SalesordersApprovalActionResponse>({
      path: ['salesorders', salesorderId, 'submit'],
    })
  }

  async approve(salesorderId: string): Promise<SalesordersApprovalActionResponse> {
    return this.http.post<SalesordersApprovalActionResponse>({
      path: ['salesorders', salesorderId, 'approve'],
    })
  }

  async approveFinal(salesorderId: string): Promise<SalesordersApprovalActionResponse> {
    return this.http.post<SalesordersApprovalActionResponse>({
      path: ['salesorders', salesorderId, 'approve', 'final'],
    })
  }

  async reject(
    salesorderId: string,
    data?: SalesordersRejectRequest
  ): Promise<SalesordersApprovalActionResponse> {
    return this.http.post<SalesordersApprovalActionResponse>({
      path: ['salesorders', salesorderId, 'reject'],
      body: data,
    })
  }

  async bulkSubmit(salesorderIds: string): Promise<SalesordersApprovalActionResponse> {
    return this.http.post<SalesordersApprovalActionResponse>({
      path: ['salesorders', 'submit'],
      query: { salesorder_ids: salesorderIds },
    })
  }

  async bulkApprove(salesorderIds: string): Promise<SalesordersApprovalActionResponse> {
    return this.http.post<SalesordersApprovalActionResponse>({
      path: ['salesorders', 'approve'],
      query: { salesorder_ids: salesorderIds },
    })
  }
}
