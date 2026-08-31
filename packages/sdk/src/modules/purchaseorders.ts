import type {
  BulkApprovePurchaseordersQuery,
  BulkSubmitPurchaseordersQuery,
  CreatePurchaseOrderRequest,
  CreatePurchaseOrderQuery,
  CreatePurchaseOrderResponse,
  GetPurchaseOrderResponse,
  ListPurchaseOrdersQuery,
  ListPurchaseOrdersResponse,
  PurchaseordersRejectRequest,
  UpdatePurchaseOrderRequest,
  UpdatePurchaseOrderQuery,
  UpdatePurchaseOrderResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'
import type { PartialBy } from '../utils.ts'

export class PurchaseOrders {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: ListPurchaseOrdersQuery
  ): Promise<ListPurchaseOrdersResponse['purchaseorders']> {
    const { purchaseorders } = await this.http.get<ListPurchaseOrdersResponse>({
      path: ['purchaseorders'],
      query: { ...params },
    })
    return purchaseorders
  }

  // purchaseorder_number is only mandatory when params.ignore_auto_number_generation is true;
  // otherwise Zoho auto-generates it. Zoho's spec always marks it required, so it's relaxed here.
  async create(
    data: PartialBy<CreatePurchaseOrderRequest, 'purchaseorder_number'>,
    params?: CreatePurchaseOrderQuery
  ): Promise<CreatePurchaseOrderResponse['purchase_order']> {
    const { purchase_order } = await this.http.post<CreatePurchaseOrderResponse>({
      path: ['purchaseorders'],
      query: params,
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
    data: PartialBy<UpdatePurchaseOrderRequest, 'purchaseorder_number'>,
    params?: UpdatePurchaseOrderQuery
  ): Promise<UpdatePurchaseOrderResponse['purchase_order']> {
    const { purchase_order } = await this.http.put<UpdatePurchaseOrderResponse>({
      path: ['purchaseorders', purchaseorderId],
      query: params,
      body: data,
    })
    return purchase_order
  }

  async delete(purchaseorderId: string): Promise<void> {
    await this.http.delete({ path: ['purchaseorders', purchaseorderId] })
  }

  async markAsIssued(purchaseorderId: string): Promise<void> {
    await this.http.post({
      path: ['purchaseorders', purchaseorderId, 'status', 'issued'],
    })
  }

  async markAsCancelled(purchaseorderId: string): Promise<void> {
    await this.http.post({
      path: ['purchaseorders', purchaseorderId, 'status', 'cancelled'],
    })
  }

  async submit(purchaseorderId: string): Promise<void> {
    await this.http.post({
      path: ['purchaseorders', purchaseorderId, 'submit'],
    })
  }

  async approve(purchaseorderId: string): Promise<void> {
    await this.http.post({
      path: ['purchaseorders', purchaseorderId, 'approve'],
    })
  }

  async reject(purchaseorderId: string, data?: PurchaseordersRejectRequest): Promise<void> {
    await this.http.post({
      path: ['purchaseorders', purchaseorderId, 'reject'],
      body: data,
    })
  }

  async finalApprove(purchaseorderId: string): Promise<void> {
    await this.http.post({
      path: ['purchaseorders', purchaseorderId, 'approve', 'final'],
    })
  }

  async bulkSubmit(params: BulkSubmitPurchaseordersQuery): Promise<void> {
    await this.http.post({
      path: ['purchaseorders', 'submit'],
      query: params,
    })
  }

  async bulkApprove(params: BulkApprovePurchaseordersQuery): Promise<void> {
    await this.http.post({
      path: ['purchaseorders', 'approve'],
      query: params,
    })
  }
}
