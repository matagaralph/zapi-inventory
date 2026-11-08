import type {
  CreateDeliveryChallanRequest,
  CreateDeliveryChallanQuery,
  CreateDeliveryChallanResponse,
  DeliveryChallansUpdateShippingAddressRequest,
  GetDeliveryChallanQuery,
  GetDeliveryChallanResponse,
  ListDeliveryChallansQuery,
  ListDeliveryChallansResponse,
  ListTemplatesResponse,
  ReturnDeliveryChallanRequest,
  ReturnDeliveryChallansQuery,
  UndoReturnDeliveryChallansQuery,
  UpdateDeliveryChallanRequest,
  UpdateDeliveryChallanResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * <p>A delivery challan is a document used to record the dispatch of goods to a customer without generating an invoice. It is typically used for goods sent on approval, job work, or for other non-sale purposes. Currently this module is available for <code class="url"><b>Global</b></code> and <code class="url"><b>India</b></code> Editions alone.</p> <h2>Supported Edition:</h2> <ul> <li>GLOBAL</li> <li>INDIA</li> </ul>
 */
export function createDeliveryChallans(http: HTTPClient) {
  return {
    async list(
      params?: ListDeliveryChallansQuery
    ): Promise<ListDeliveryChallansResponse['deliverychallans']> {
      const { deliverychallans } = await http.get<ListDeliveryChallansResponse>({
        path: ['deliverychallans'],
        query: { ...params },
      })
      return deliverychallans
    },

    async create(
      data: CreateDeliveryChallanRequest,
      params?: CreateDeliveryChallanQuery
    ): Promise<CreateDeliveryChallanResponse['deliverychallan']> {
      const { deliverychallan } = await http.post<CreateDeliveryChallanResponse>({
        path: ['deliverychallans'],
        query: { ...params },
        body: data,
      })
      return deliverychallan
    },

    async get(
      deliverychallanId: string,
      params?: GetDeliveryChallanQuery
    ): Promise<GetDeliveryChallanResponse['deliverychallan']> {
      const { deliverychallan } = await http.get<GetDeliveryChallanResponse>({
        path: ['deliverychallans', deliverychallanId],
        query: { ...params },
      })
      return deliverychallan
    },

    async update(
      deliverychallanId: string,
      data: UpdateDeliveryChallanRequest
    ): Promise<UpdateDeliveryChallanResponse['deliverychallan']> {
      const { deliverychallan } = await http.put<UpdateDeliveryChallanResponse>({
        path: ['deliverychallans', deliverychallanId],
        body: data,
      })
      return deliverychallan
    },

    async delete(deliverychallanId: string): Promise<void> {
      await http.delete({
        path: ['deliverychallans', deliverychallanId],
      })
    },

    async markAsOpen(deliverychallanId: string): Promise<void> {
      await http.post({
        path: ['deliverychallans', deliverychallanId, 'status', 'open'],
      })
    },

    async markAsDelivered(deliverychallanId: string): Promise<void> {
      await http.post({
        path: ['deliverychallans', deliverychallanId, 'status', 'delivered'],
      })
    },

    async markAsReturned(deliverychallanId: string): Promise<void> {
      await http.post({
        path: ['deliverychallans', deliverychallanId, 'status', 'returned'],
      })
    },

    async markAsUndelivered(deliverychallanId: string): Promise<void> {
      await http.post({
        path: ['deliverychallans', deliverychallanId, 'status', 'undelivered'],
      })
    },

    async return(
      params: ReturnDeliveryChallansQuery,
      data: ReturnDeliveryChallanRequest
    ): Promise<void> {
      await http.put({
        path: ['deliverychallans', 'return'],
        query: params,
        body: data,
      })
    },

    async undoReturn(params: UndoReturnDeliveryChallansQuery): Promise<void> {
      await http.put({
        path: ['deliverychallans', 'undo', 'return'],
        query: params,
      })
    },

    async addAttachment(deliverychallanId: string, attachment: Blob): Promise<void> {
      const formData = new FormData()
      formData.append('attachment', attachment)
      await http.post({
        path: ['deliverychallans', deliverychallanId, 'attachment'],
        body: formData,
      })
    },

    async getAttachment(deliverychallanId: string, documentId: string): Promise<Blob> {
      return http.get<Blob>({
        path: ['deliverychallans', deliverychallanId, 'documents', documentId],
      })
    },

    async deleteAttachment(deliverychallanId: string, documentId: string): Promise<void> {
      await http.delete({
        path: ['deliverychallans', deliverychallanId, 'documents', documentId],
      })
    },

    async listTemplates(): Promise<ListTemplatesResponse['templates']> {
      const { templates } = await http.get<ListTemplatesResponse>({
        path: ['deliverychallans', 'templates'],
      })
      return templates
    },

    async updateTemplate(deliverychallanId: string, templateId: string): Promise<void> {
      await http.put({
        path: ['deliverychallans', deliverychallanId, 'templates', templateId],
      })
    },

    async updateShippingAddress(
      deliverychallanId: string,
      data: DeliveryChallansUpdateShippingAddressRequest
    ): Promise<void> {
      await http.put({
        path: ['deliverychallans', deliverychallanId, 'address', 'shipping'],
        body: data,
      })
    },
  }
}

export type DeliveryChallans = ReturnType<typeof createDeliveryChallans>
