import type {
  BulkDeleteTransferOrdersQuery,
  CreateTransferOrderRequest,
  CreateTransferOrderQuery,
  CreateTransferOrderResponse,
  GetTransferOrderResponse,
  ListTransferOrdersQuery,
  ListTransferOrdersResponse,
  MarkTransferOrderAsReceivedQuery,
  MarkTransferOrderInTransitQuery,
  TransferordersRejectRequest,
  UpdateTransferOrderRequest,
  UpdateTransferOrderQuery,
  UpdateTransferOrderResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'
import type { PartialBy } from '../utils.ts'

export class TransferOrders {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: ListTransferOrdersQuery
  ): Promise<ListTransferOrdersResponse['transfer_orders']> {
    const { transfer_orders } = await this.http.get<ListTransferOrdersResponse>({
      path: ['transferorders'],
      query: params,
    })
    return transfer_orders
  }

  // transfer_order_number is only mandatory when params.ignore_auto_number_generation is true;
  // otherwise Zoho auto-generates it. Zoho's spec always marks it required, so it's relaxed here.
  async create(
    data: PartialBy<CreateTransferOrderRequest, 'transfer_order_number'>,
    params?: CreateTransferOrderQuery
  ): Promise<CreateTransferOrderResponse['transfer_order']> {
    const { transfer_order } = await this.http.post<CreateTransferOrderResponse>({
      path: ['transferorders'],
      query: params,
      body: data,
    })
    return transfer_order
  }

  async bulkDelete(params: BulkDeleteTransferOrdersQuery): Promise<void> {
    await this.http.delete({
      path: ['transferorders'],
      query: params,
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
    data: PartialBy<UpdateTransferOrderRequest, 'transfer_order_number'>,
    params?: UpdateTransferOrderQuery
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
    params: MarkTransferOrderAsReceivedQuery
  ): Promise<void> {
    await this.http.post({
      path: ['transferorders', transferOrderId, 'markastransferred'],
      query: params,
    })
  }

  async markInTransit(
    transferOrderId: string,
    params?: MarkTransferOrderInTransitQuery
  ): Promise<void> {
    await this.http.post({
      path: ['transferorders', transferOrderId, 'intransit'],
      query: params,
    })
  }

  async submit(transferOrderId: string): Promise<void> {
    await this.http.post({
      path: ['transferorders', transferOrderId, 'submit'],
    })
  }

  async approve(transferOrderId: string): Promise<void> {
    await this.http.post({
      path: ['transferorders', transferOrderId, 'approve'],
    })
  }

  async approveFinal(transferOrderId: string): Promise<void> {
    await this.http.post({
      path: ['transferorders', transferOrderId, 'approve', 'final'],
    })
  }

  async reject(transferOrderId: string, data?: TransferordersRejectRequest): Promise<void> {
    await this.http.post({
      path: ['transferorders', transferOrderId, 'reject'],
      body: data,
    })
  }
}
