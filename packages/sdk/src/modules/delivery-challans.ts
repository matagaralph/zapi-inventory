import type {
  ActionDeliveryChallanResponse,
  CreateDeliveryChallanRequest,
  CreateDeliveryChallanQuery,
  CreateDeliveryChallanResponse,
  DeleteDeliveryChallanResponse,
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

export class DeliveryChallans {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: ListDeliveryChallansQuery
  ): Promise<ListDeliveryChallansResponse['deliverychallans']> {
    const { deliverychallans } = await this.http.get<ListDeliveryChallansResponse>({
      path: ['deliverychallans'],
      query: { ...params },
    })
    return deliverychallans
  }

  async create(
    data: CreateDeliveryChallanRequest,
    params?: CreateDeliveryChallanQuery
  ): Promise<CreateDeliveryChallanResponse['deliverychallan']> {
    const { deliverychallan } = await this.http.post<CreateDeliveryChallanResponse>({
      path: ['deliverychallans'],
      query: { ...params },
      body: data,
    })
    return deliverychallan
  }

  async get(
    deliverychallanId: string,
    params?: GetDeliveryChallanQuery
  ): Promise<GetDeliveryChallanResponse['deliverychallan']> {
    const { deliverychallan } = await this.http.get<GetDeliveryChallanResponse>({
      path: ['deliverychallans', deliverychallanId],
      query: { ...params },
    })
    return deliverychallan
  }

  async update(
    deliverychallanId: string,
    data: UpdateDeliveryChallanRequest
  ): Promise<UpdateDeliveryChallanResponse['deliverychallan']> {
    const { deliverychallan } = await this.http.put<UpdateDeliveryChallanResponse>({
      path: ['deliverychallans', deliverychallanId],
      body: data,
    })
    return deliverychallan
  }

  async delete(deliverychallanId: string): Promise<DeleteDeliveryChallanResponse> {
    return this.http.delete<DeleteDeliveryChallanResponse>({
      path: ['deliverychallans', deliverychallanId],
    })
  }

  async markAsOpen(deliverychallanId: string): Promise<ActionDeliveryChallanResponse> {
    return this.http.post<ActionDeliveryChallanResponse>({
      path: ['deliverychallans', deliverychallanId, 'status', 'open'],
    })
  }

  async markAsDelivered(deliverychallanId: string): Promise<ActionDeliveryChallanResponse> {
    return this.http.post<ActionDeliveryChallanResponse>({
      path: ['deliverychallans', deliverychallanId, 'status', 'delivered'],
    })
  }

  async markAsReturned(deliverychallanId: string): Promise<ActionDeliveryChallanResponse> {
    return this.http.post<ActionDeliveryChallanResponse>({
      path: ['deliverychallans', deliverychallanId, 'status', 'returned'],
    })
  }

  async markAsUndelivered(deliverychallanId: string): Promise<ActionDeliveryChallanResponse> {
    return this.http.post<ActionDeliveryChallanResponse>({
      path: ['deliverychallans', deliverychallanId, 'status', 'undelivered'],
    })
  }

  async return(
    params: ReturnDeliveryChallansQuery,
    data: ReturnDeliveryChallanRequest
  ): Promise<ActionDeliveryChallanResponse> {
    return this.http.put<ActionDeliveryChallanResponse>({
      path: ['deliverychallans', 'return'],
      query: params,
      body: data,
    })
  }

  async undoReturn(
    params: UndoReturnDeliveryChallansQuery
  ): Promise<ActionDeliveryChallanResponse> {
    return this.http.put<ActionDeliveryChallanResponse>({
      path: ['deliverychallans', 'undo', 'return'],
      query: params,
    })
  }

  async addAttachment(
    deliverychallanId: string,
    attachment: Blob
  ): Promise<ActionDeliveryChallanResponse> {
    const formData = new FormData()
    formData.append('attachment', attachment)
    return this.http.post<ActionDeliveryChallanResponse>({
      path: ['deliverychallans', deliverychallanId, 'attachment'],
      body: formData,
    })
  }

  async getAttachment(deliverychallanId: string, documentId: string): Promise<Blob> {
    return this.http.get<Blob>({
      path: ['deliverychallans', deliverychallanId, 'documents', documentId],
    })
  }

  async deleteAttachment(
    deliverychallanId: string,
    documentId: string
  ): Promise<ActionDeliveryChallanResponse> {
    return this.http.delete<ActionDeliveryChallanResponse>({
      path: ['deliverychallans', deliverychallanId, 'documents', documentId],
    })
  }

  async listTemplates(): Promise<ListTemplatesResponse['templates']> {
    const { templates } = await this.http.get<ListTemplatesResponse>({
      path: ['deliverychallans', 'templates'],
    })
    return templates
  }

  async updateTemplate(
    deliverychallanId: string,
    templateId: string
  ): Promise<ActionDeliveryChallanResponse> {
    return this.http.put<ActionDeliveryChallanResponse>({
      path: ['deliverychallans', deliverychallanId, 'templates', templateId],
    })
  }

  async updateShippingAddress(
    deliverychallanId: string,
    data: DeliveryChallansUpdateShippingAddressRequest
  ): Promise<ActionDeliveryChallanResponse> {
    return this.http.put<ActionDeliveryChallanResponse>({
      path: ['deliverychallans', deliverychallanId, 'address', 'shipping'],
      body: data,
    })
  }
}
