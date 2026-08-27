import type {
  CreateTransferOrderRequest,
  CreateTransferOrderResponse,
  GetTransferOrderResponse,
  ListTransferOrdersResponse,
  MarkInTransitResponse,
  TransferordersApprovalActionResponse,
  TransferordersMarkAsReceivedResponse,
  TransferordersRejectRequest,
  UpdateTransferOrderRequest,
  UpdateTransferOrderResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class TransferOrders {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListTransferOrdersResponse['transfer_orders']> {
    const { transfer_orders } = await this.http.get<ListTransferOrdersResponse>({
      path: ['transferorders'],
      query: params,
    })
    return transfer_orders
  }

  async create(
    data: CreateTransferOrderRequest,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<CreateTransferOrderResponse['transfer_order']> {
    const { transfer_order } = await this.http.post<CreateTransferOrderResponse>({
      path: ['transferorders'],
      query: params,
      body: data,
    })
    return transfer_order
  }

  async bulkDelete(transferOrderIds: string): Promise<void> {
    await this.http.delete({
      path: ['transferorders'],
      query: { transfer_order_ids: transferOrderIds },
    })
  }

  async get(transferOrderId: string): Promise<GetTransferOrderResponse['transfer_order']> {
    const { transfer_order } = await this.http.get<GetTransferOrderResponse>({
      path: ['transferorders', transferOrderId],
    })
    return transfer_order
  }

  async update(
    transferOrderId: string,
    data: UpdateTransferOrderRequest,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<UpdateTransferOrderResponse['transfer_order']> {
    const { transfer_order } = await this.http.put<UpdateTransferOrderResponse>({
      path: ['transferorders', transferOrderId],
      query: params,
      body: data,
    })
    return transfer_order
  }

  async delete(transferOrderId: string): Promise<void> {
    await this.http.delete({ path: ['transferorders', transferOrderId] })
  }

  async markAsReceived(
    transferOrderId: string,
    date: string
  ): Promise<TransferordersMarkAsReceivedResponse> {
    return this.http.post<TransferordersMarkAsReceivedResponse>({
      path: ['transferorders', transferOrderId, 'markastransferred'],
      query: { date },
    })
  }

  async markInTransit(
    transferOrderId: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<MarkInTransitResponse> {
    return this.http.post<MarkInTransitResponse>({
      path: ['transferorders', transferOrderId, 'intransit'],
      query: params,
    })
  }

  async submit(transferOrderId: string): Promise<TransferordersApprovalActionResponse> {
    return this.http.post<TransferordersApprovalActionResponse>({
      path: ['transferorders', transferOrderId, 'submit'],
    })
  }

  async approve(transferOrderId: string): Promise<TransferordersApprovalActionResponse> {
    return this.http.post<TransferordersApprovalActionResponse>({
      path: ['transferorders', transferOrderId, 'approve'],
    })
  }

  async approveFinal(transferOrderId: string): Promise<TransferordersApprovalActionResponse> {
    return this.http.post<TransferordersApprovalActionResponse>({
      path: ['transferorders', transferOrderId, 'approve', 'final'],
    })
  }

  async reject(
    transferOrderId: string,
    data?: TransferordersRejectRequest
  ): Promise<TransferordersApprovalActionResponse> {
    return this.http.post<TransferordersApprovalActionResponse>({
      path: ['transferorders', transferOrderId, 'reject'],
      body: data,
    })
  }
}
