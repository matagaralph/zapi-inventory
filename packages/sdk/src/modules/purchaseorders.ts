import type {
  CreatePurchaseOrderRequest,
  CreatePurchaseOrderResponse,
  GetPurchaseOrderResponse,
  ListPurchaseOrdersResponse,
  MarkAsCancelledResponse,
  MarkAsIssuedResponse,
  PurchaseordersApprovalActionResponse,
  PurchaseordersRejectRequest,
  UpdatePurchaseOrderRequest,
  UpdatePurchaseOrderResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class PurchaseOrders {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListPurchaseOrdersResponse['purchaseorders']> {
    const { purchaseorders } = await this.http.get<ListPurchaseOrdersResponse>({
      path: ['purchaseorders'],
      query: { ...params },
    })
    return purchaseorders
  }

  async create(
    data: CreatePurchaseOrderRequest,
    ignoreAutoNumberGeneration?: boolean
  ): Promise<CreatePurchaseOrderResponse['purchase_order']> {
    const { purchase_order } = await this.http.post<CreatePurchaseOrderResponse>({
      path: ['purchaseorders'],
      query: { ignore_auto_number_generation: ignoreAutoNumberGeneration },
      body: data,
    })
    return purchase_order
  }

  async get(purchaseorderId: string): Promise<GetPurchaseOrderResponse['purchase_order']> {
    const { purchase_order } = await this.http.get<GetPurchaseOrderResponse>({
      path: ['purchaseorders', purchaseorderId],
    })
    return purchase_order
  }

  async update(
    purchaseorderId: string,
    data: UpdatePurchaseOrderRequest,
    ignoreAutoNumberGeneration?: boolean
  ): Promise<UpdatePurchaseOrderResponse['purchase_order']> {
    const { purchase_order } = await this.http.put<UpdatePurchaseOrderResponse>({
      path: ['purchaseorders', purchaseorderId],
      query: { ignore_auto_number_generation: ignoreAutoNumberGeneration },
      body: data,
    })
    return purchase_order
  }

  async delete(purchaseorderId: string): Promise<void> {
    await this.http.delete({ path: ['purchaseorders', purchaseorderId] })
  }

  async markAsIssued(purchaseorderId: string): Promise<MarkAsIssuedResponse> {
    return this.http.post<MarkAsIssuedResponse>({
      path: ['purchaseorders', purchaseorderId, 'status', 'issued'],
    })
  }

  async markAsCancelled(purchaseorderId: string): Promise<MarkAsCancelledResponse> {
    return this.http.post<MarkAsCancelledResponse>({
      path: ['purchaseorders', purchaseorderId, 'status', 'cancelled'],
    })
  }

  async submit(purchaseorderId: string): Promise<PurchaseordersApprovalActionResponse> {
    return this.http.post<PurchaseordersApprovalActionResponse>({
      path: ['purchaseorders', purchaseorderId, 'submit'],
    })
  }

  async approve(purchaseorderId: string): Promise<PurchaseordersApprovalActionResponse> {
    return this.http.post<PurchaseordersApprovalActionResponse>({
      path: ['purchaseorders', purchaseorderId, 'approve'],
    })
  }

  async reject(
    purchaseorderId: string,
    data?: PurchaseordersRejectRequest
  ): Promise<PurchaseordersApprovalActionResponse> {
    return this.http.post<PurchaseordersApprovalActionResponse>({
      path: ['purchaseorders', purchaseorderId, 'reject'],
      body: data,
    })
  }

  async finalApprove(purchaseorderId: string): Promise<PurchaseordersApprovalActionResponse> {
    return this.http.post<PurchaseordersApprovalActionResponse>({
      path: ['purchaseorders', purchaseorderId, 'approve', 'final'],
    })
  }

  async bulkSubmit(purchaseorderIds: string): Promise<PurchaseordersApprovalActionResponse> {
    return this.http.post<PurchaseordersApprovalActionResponse>({
      path: ['purchaseorders', 'submit'],
      query: { purchaseorder_ids: purchaseorderIds },
    })
  }

  async bulkApprove(purchaseorderIds: string): Promise<PurchaseordersApprovalActionResponse> {
    return this.http.post<PurchaseordersApprovalActionResponse>({
      path: ['purchaseorders', 'approve'],
      query: { purchaseorder_ids: purchaseorderIds },
    })
  }
}
