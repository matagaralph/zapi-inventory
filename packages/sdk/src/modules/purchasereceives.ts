import type {
  AddAttachmentResponse,
  BulkStatusUpdateRequest,
  BulkDeletePurchaseReceivesQuery,
  CreatePurchaseReceiveRequest,
  CreatePurchaseReceiveQuery,
  CreatePurchaseReceiveResponse,
  DeletePurchaseReceiveResponse,
  DeletePurchaseReceiveAttachmentQuery,
  GetPurchaseReceiveAttachmentQuery,
  GetPurchaseReceiveQuery,
  GetPurchaseReceiveResponse,
  ListPurchaseReceivesResponse,
  ListPurchaseReceivesQuery,
  MarkAsInTransitResponse,
  MarkAsReceivedResponse,
  MarkPurchaseReceiveAsReceivedQuery,
  PurchasereceivesAddCommentRequest,
  PurchasereceivesAddCommentResponse,
  PurchasereceivesDeleteAttachmentResponse,
  RejectPurchaseReceiveQuery,
  RejectPurchaseReceiveResponse,
  SubmitPurchaseReceiveResponse,
  ApprovePurchaseReceiveResponse,
  UpdatePurchaseReceiveRequest,
  UpdatePurchaseReceiveQuery,
  UpdatePurchaseReceiveResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class PurchaseReceives {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: ListPurchaseReceivesQuery
  ): Promise<ListPurchaseReceivesResponse['purchasereceives']> {
    const { purchasereceives } = await this.http.get<ListPurchaseReceivesResponse>({
      path: ['purchasereceives'],
      query: { ...params },
    })
    return purchasereceives
  }

  async create(
    data: CreatePurchaseReceiveRequest,
    params: CreatePurchaseReceiveQuery
  ): Promise<CreatePurchaseReceiveResponse['purchase_receive']> {
    const { purchase_receive } = await this.http.post<CreatePurchaseReceiveResponse>({
      path: ['purchasereceives'],
      query: params,
      body: data,
    })
    return purchase_receive
  }

  async bulkDelete(
    params: BulkDeletePurchaseReceivesQuery
  ): Promise<DeletePurchaseReceiveResponse> {
    return this.http.delete<DeletePurchaseReceiveResponse>({
      path: ['purchasereceives'],
      query: params,
    })
  }

  async get(
    purchasereceiveId: string,
    params?: GetPurchaseReceiveQuery
  ): Promise<GetPurchaseReceiveResponse['purchase_receive']> {
    const { purchase_receive } = await this.http.get<GetPurchaseReceiveResponse>({
      path: ['purchasereceives', purchasereceiveId],
      query: params,
    })
    return purchase_receive
  }

  async update(
    purchasereceiveId: string,
    data: UpdatePurchaseReceiveRequest,
    params?: UpdatePurchaseReceiveQuery
  ): Promise<UpdatePurchaseReceiveResponse['purchase_receive']> {
    const { purchase_receive } = await this.http.put<UpdatePurchaseReceiveResponse>({
      path: ['purchasereceives', purchasereceiveId],
      query: params,
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

  async reject(
    purchasereceiveId: string,
    params?: RejectPurchaseReceiveQuery
  ): Promise<RejectPurchaseReceiveResponse> {
    return this.http.post<RejectPurchaseReceiveResponse>({
      path: ['purchasereceives', purchasereceiveId, 'reject'],
      query: params,
    })
  }

  async markAsReceived(
    purchasereceiveId: string,
    params?: MarkPurchaseReceiveAsReceivedQuery
  ): Promise<MarkAsReceivedResponse> {
    return this.http.post<MarkAsReceivedResponse>({
      path: ['purchasereceives', purchasereceiveId, 'setstatusasreceived'],
      query: params,
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
    params?: GetPurchaseReceiveAttachmentQuery
  ): Promise<Blob> {
    return this.http.get<Blob>({
      path: ['purchasereceives', purchasereceiveId, 'documents', documentId],
      query: { ...params },
    })
  }

  async deleteAttachment(
    purchasereceiveId: string,
    documentId: string,
    params?: DeletePurchaseReceiveAttachmentQuery
  ): Promise<PurchasereceivesDeleteAttachmentResponse> {
    return this.http.delete<PurchasereceivesDeleteAttachmentResponse>({
      path: ['purchasereceives', purchasereceiveId, 'documents', documentId],
      query: params,
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
