import type {
  AddAttachmentResponse,
  BulkStatusUpdateRequest,
  BulkDeletePurchaseReceivesQuery,
  CreatePurchaseReceiveRequest,
  CreatePurchaseReceiveQuery,
  CreatePurchaseReceiveResponse,
  DeletePurchaseReceiveAttachmentQuery,
  GetPurchaseReceiveAttachmentQuery,
  GetPurchaseReceiveQuery,
  GetPurchaseReceiveResponse,
  ListPurchaseReceivesResponse,
  ListPurchaseReceivesQuery,
  MarkPurchaseReceiveAsReceivedQuery,
  PurchasereceivesAddCommentRequest,
  PurchasereceivesAddCommentResponse,
  RejectPurchaseReceiveQuery,
  UpdatePurchaseReceiveRequest,
  UpdatePurchaseReceiveQuery,
  UpdatePurchaseReceiveResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * A new purchase receive can be created. To create a purchase receive, the URL parameter <code>purchaseorder_id</code> is needed.
 */
export function createPurchaseReceives(http: HTTPClient) {
  return {
    async list(
      params?: ListPurchaseReceivesQuery
    ): Promise<ListPurchaseReceivesResponse['purchasereceives']> {
      const { purchasereceives } = await http.get<ListPurchaseReceivesResponse>({
        path: ['purchasereceives'],
        query: { ...params },
      })
      return purchasereceives
    },

    async create(
      data: CreatePurchaseReceiveRequest,
      params: CreatePurchaseReceiveQuery
    ): Promise<CreatePurchaseReceiveResponse['purchasereceive']> {
      const { purchasereceive } = await http.post<CreatePurchaseReceiveResponse>({
        path: ['purchasereceives'],
        query: params,
        body: data,
      })
      return purchasereceive
    },

    async bulkDelete(params: BulkDeletePurchaseReceivesQuery): Promise<void> {
      await http.delete({
        path: ['purchasereceives'],
        query: params,
      })
    },

    async get(
      purchasereceiveId: string,
      params?: GetPurchaseReceiveQuery
    ): Promise<GetPurchaseReceiveResponse['purchasereceive']> {
      const { purchasereceive } = await http.get<GetPurchaseReceiveResponse>({
        path: ['purchasereceives', purchasereceiveId],
        query: params,
      })
      return purchasereceive
    },

    async update(
      purchasereceiveId: string,
      data: UpdatePurchaseReceiveRequest,
      params?: UpdatePurchaseReceiveQuery
    ): Promise<UpdatePurchaseReceiveResponse['purchasereceive']> {
      const { purchasereceive } = await http.put<UpdatePurchaseReceiveResponse>({
        path: ['purchasereceives', purchasereceiveId],
        query: params,
        body: data,
      })
      return purchasereceive
    },

    async delete(purchasereceiveId: string): Promise<void> {
      await http.delete({ path: ['purchasereceives', purchasereceiveId] })
    },

    async submit(purchasereceiveId: string): Promise<void> {
      await http.post({
        path: ['purchasereceives', purchasereceiveId, 'submit'],
      })
    },

    async approve(purchasereceiveId: string): Promise<void> {
      await http.post({
        path: ['purchasereceives', purchasereceiveId, 'approve'],
      })
    },

    async reject(purchasereceiveId: string, params?: RejectPurchaseReceiveQuery): Promise<void> {
      await http.post({
        path: ['purchasereceives', purchasereceiveId, 'reject'],
        query: params,
      })
    },

    async markAsReceived(
      purchasereceiveId: string,
      params?: MarkPurchaseReceiveAsReceivedQuery
    ): Promise<void> {
      await http.post({
        path: ['purchasereceives', purchasereceiveId, 'setstatusasreceived'],
        query: params,
      })
    },

    async markAsInTransit(purchasereceiveId: string): Promise<void> {
      await http.post({
        path: ['purchasereceives', purchasereceiveId, 'setstatusasintransit'],
      })
    },

    async bulkMarkAsReceived(data: BulkStatusUpdateRequest): Promise<void> {
      await http.post({
        path: ['purchasereceives', 'setstatusasreceived'],
        body: data,
      })
    },

    async bulkMarkAsInTransit(data: BulkStatusUpdateRequest): Promise<void> {
      await http.post({
        path: ['purchasereceives', 'setstatusasintransit'],
        body: data,
      })
    },

    async addAttachment(
      purchasereceiveId: string,
      attachment: Blob
    ): Promise<AddAttachmentResponse> {
      const body = new FormData()
      body.append('attachment', attachment)
      return http.post<AddAttachmentResponse>({
        path: ['purchasereceives', purchasereceiveId, 'attachment'],
        body,
      })
    },

    async getAttachment(
      purchasereceiveId: string,
      documentId: string,
      params?: GetPurchaseReceiveAttachmentQuery
    ): Promise<Blob> {
      return http.get<Blob>({
        path: ['purchasereceives', purchasereceiveId, 'documents', documentId],
        query: { ...params },
      })
    },

    async deleteAttachment(
      purchasereceiveId: string,
      documentId: string,
      params?: DeletePurchaseReceiveAttachmentQuery
    ): Promise<void> {
      await http.delete({
        path: ['purchasereceives', purchasereceiveId, 'documents', documentId],
        query: params,
      })
    },

    async addComment(
      purchasereceiveId: string,
      data: PurchasereceivesAddCommentRequest
    ): Promise<PurchasereceivesAddCommentResponse['comment']> {
      const { comment } = await http.post<PurchasereceivesAddCommentResponse>({
        path: ['purchasereceives', purchasereceiveId, 'comments'],
        body: data,
      })
      return comment
    },

    async deleteComment(purchasereceiveId: string, commentId: string): Promise<void> {
      await http.delete({ path: ['purchasereceives', purchasereceiveId, 'comments', commentId] })
    },
  }
}

export type PurchaseReceives = ReturnType<typeof createPurchaseReceives>
