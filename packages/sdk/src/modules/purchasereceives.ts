import type {
  AddAttachmentResponse,
  BulkStatusUpdateRequest,
  CreatePurchaseReceiveRequest,
  CreatePurchaseReceiveResponse,
  DeletePurchaseReceiveResponse,
  GetPurchaseReceiveResponse,
  ListPurchaseReceivesResponse,
  MarkAsInTransitResponse,
  MarkAsReceivedResponse,
  PurchasereceivesAddCommentRequest,
  PurchasereceivesAddCommentResponse,
  PurchasereceivesDeleteAttachmentResponse,
  RejectPurchaseReceiveResponse,
  SubmitPurchaseReceiveResponse,
  ApprovePurchaseReceiveResponse,
  UpdatePurchaseReceiveRequest,
  UpdatePurchaseReceiveResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class PurchaseReceives {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListPurchaseReceivesResponse['purchasereceives']> {
    const { purchasereceives } = await this.http.get<ListPurchaseReceivesResponse>({
      path: ['purchasereceives'],
      query: { ...params },
    })
    return purchasereceives
  }

  async create(
    purchaseorderId: string,
    data: CreatePurchaseReceiveRequest,
    ignoreAutoNumberGeneration?: boolean
  ): Promise<CreatePurchaseReceiveResponse['purchase_receive']> {
    const { purchase_receive } = await this.http.post<CreatePurchaseReceiveResponse>({
      path: ['purchasereceives'],
      query: {
        purchaseorder_id: purchaseorderId,
        ignore_auto_number_generation: ignoreAutoNumberGeneration,
      },
      body: data,
    })
    return purchase_receive
  }

  async bulkDelete(receiveIds: string): Promise<DeletePurchaseReceiveResponse> {
    return this.http.delete<DeletePurchaseReceiveResponse>({
      path: ['purchasereceives'],
      query: { receive_ids: receiveIds },
    })
  }

  async get(
    purchasereceiveId: string,
    print?: boolean
  ): Promise<GetPurchaseReceiveResponse['purchase_receive']> {
    const { purchase_receive } = await this.http.get<GetPurchaseReceiveResponse>({
      path: ['purchasereceives', purchasereceiveId],
      query: { print },
    })
    return purchase_receive
  }

  async update(
    purchasereceiveId: string,
    data: UpdatePurchaseReceiveRequest,
    ignoreAutoNumberGeneration?: boolean
  ): Promise<UpdatePurchaseReceiveResponse['purchase_receive']> {
    const { purchase_receive } = await this.http.put<UpdatePurchaseReceiveResponse>({
      path: ['purchasereceives', purchasereceiveId],
      query: { ignore_auto_number_generation: ignoreAutoNumberGeneration },
      body: data,
    })
    return purchase_receive
  }

  async delete(purchasereceiveId: string): Promise<void> {
    await this.http.delete({ path: ['purchasereceives', purchasereceiveId] })
  }

  async submit(purchasereceiveId: string): Promise<SubmitPurchaseReceiveResponse> {
    return this.http.post<SubmitPurchaseReceiveResponse>({
      path: ['purchasereceives', purchasereceiveId, 'submit'],
    })
  }

  async approve(purchasereceiveId: string): Promise<ApprovePurchaseReceiveResponse> {
    return this.http.post<ApprovePurchaseReceiveResponse>({
      path: ['purchasereceives', purchasereceiveId, 'approve'],
    })
  }

  async reject(purchasereceiveId: string, reason?: string): Promise<RejectPurchaseReceiveResponse> {
    return this.http.post<RejectPurchaseReceiveResponse>({
      path: ['purchasereceives', purchasereceiveId, 'reject'],
      query: { reason },
    })
  }

  async markAsReceived(purchasereceiveId: string, date?: string): Promise<MarkAsReceivedResponse> {
    return this.http.post<MarkAsReceivedResponse>({
      path: ['purchasereceives', purchasereceiveId, 'setstatusasreceived'],
      query: { date },
    })
  }

  async markAsInTransit(purchasereceiveId: string): Promise<MarkAsInTransitResponse> {
    return this.http.post<MarkAsInTransitResponse>({
      path: ['purchasereceives', purchasereceiveId, 'setstatusasintransit'],
    })
  }

  async bulkMarkAsReceived(data: BulkStatusUpdateRequest): Promise<MarkAsReceivedResponse> {
    return this.http.post<MarkAsReceivedResponse>({
      path: ['purchasereceives', 'setstatusasreceived'],
      body: data,
    })
  }

  async bulkMarkAsInTransit(data: BulkStatusUpdateRequest): Promise<MarkAsInTransitResponse> {
    return this.http.post<MarkAsInTransitResponse>({
      path: ['purchasereceives', 'setstatusasintransit'],
      body: data,
    })
  }

  async addAttachment(purchasereceiveId: string, attachment: Blob): Promise<AddAttachmentResponse> {
    const body = new FormData()
    body.append('attachment', attachment)
    return this.http.post<AddAttachmentResponse>({
      path: ['purchasereceives', purchasereceiveId, 'attachment'],
      body,
    })
  }

  async getAttachment(
    purchasereceiveId: string,
    documentId: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<unknown> {
    return this.http.get({
      path: ['purchasereceives', purchasereceiveId, 'documents', documentId],
      query: { ...params },
    })
  }

  async deleteAttachment(
    purchasereceiveId: string,
    documentId: string,
    unAssociate?: boolean
  ): Promise<PurchasereceivesDeleteAttachmentResponse> {
    return this.http.delete<PurchasereceivesDeleteAttachmentResponse>({
      path: ['purchasereceives', purchasereceiveId, 'documents', documentId],
      query: { un_associate: unAssociate },
    })
  }

  async addComment(
    purchasereceiveId: string,
    data: PurchasereceivesAddCommentRequest
  ): Promise<PurchasereceivesAddCommentResponse['comment']> {
    const { comment } = await this.http.post<PurchasereceivesAddCommentResponse>({
      path: ['purchasereceives', purchasereceiveId, 'comments'],
      body: data,
    })
    return comment
  }

  async deleteComment(purchasereceiveId: string, commentId: string): Promise<void> {
    await this.http.delete({ path: ['purchasereceives', purchasereceiveId, 'comments', commentId] })
  }
}
