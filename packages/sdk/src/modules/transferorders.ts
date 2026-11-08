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

/**
 * Transfer Orders allow you transfer stock from one location to another, thereby greatly reducing the hassle of manually updating the stock levels.
 */
export function createTransferOrders(http: HTTPClient) {
  return {
    async list(
      params?: ListTransferOrdersQuery
    ): Promise<ListTransferOrdersResponse['transfer_orders']> {
      const { transfer_orders } = await http.get<ListTransferOrdersResponse>({
        path: ['transferorders'],
        query: params,
      })
      return transfer_orders
    },

    // transfer_order_number is only mandatory when params.ignore_auto_number_generation is true.
    // Otherwise Zoho auto-generates it. Zoho's spec always marks it required, so it's relaxed here.
    async create(
      data: PartialBy<CreateTransferOrderRequest, 'transfer_order_number'>,
      params?: CreateTransferOrderQuery
    ): Promise<CreateTransferOrderResponse['transfer_order']> {
      const { transfer_order } = await http.post<CreateTransferOrderResponse>({
        path: ['transferorders'],
        query: params,
        body: data,
      })
      return transfer_order
    },

    async bulkDelete(params: BulkDeleteTransferOrdersQuery): Promise<void> {
      await http.delete({
        path: ['transferorders'],
        query: params,
      })
    },

    async get(transferOrderId: string): Promise<GetTransferOrderResponse['transfer_order']> {
      const { transfer_order } = await http.get<GetTransferOrderResponse>({
        path: ['transferorders', transferOrderId],
      })
      return transfer_order
    },

    async update(
      transferOrderId: string,
      data: PartialBy<UpdateTransferOrderRequest, 'transfer_order_number'>,
      params?: UpdateTransferOrderQuery
    ): Promise<UpdateTransferOrderResponse['transfer_order']> {
      const { transfer_order } = await http.put<UpdateTransferOrderResponse>({
        path: ['transferorders', transferOrderId],
        query: params,
        body: data,
      })
      return transfer_order
    },

    async delete(transferOrderId: string): Promise<void> {
      await http.delete({ path: ['transferorders', transferOrderId] })
    },

    async markAsReceived(
      transferOrderId: string,
      params: MarkTransferOrderAsReceivedQuery
    ): Promise<void> {
      await http.post({
        path: ['transferorders', transferOrderId, 'markastransferred'],
        query: params,
      })
    },

    async markInTransit(
      transferOrderId: string,
      params?: MarkTransferOrderInTransitQuery
    ): Promise<void> {
      await http.post({
        path: ['transferorders', transferOrderId, 'intransit'],
        query: params,
      })
    },

    async submit(transferOrderId: string): Promise<void> {
      await http.post({
        path: ['transferorders', transferOrderId, 'submit'],
      })
    },

    async approve(transferOrderId: string): Promise<void> {
      await http.post({
        path: ['transferorders', transferOrderId, 'approve'],
      })
    },

    async approveFinal(transferOrderId: string): Promise<void> {
      await http.post({
        path: ['transferorders', transferOrderId, 'approve', 'final'],
      })
    },

    async reject(transferOrderId: string, data?: TransferordersRejectRequest): Promise<void> {
      await http.post({
        path: ['transferorders', transferOrderId, 'reject'],
        body: data,
      })
    },
  }
}

export type TransferOrders = ReturnType<typeof createTransferOrders>
