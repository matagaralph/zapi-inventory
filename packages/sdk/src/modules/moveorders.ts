import type {
  CreateMoveOrderRequest,
  CreateMoveOrderQuery,
  CreateMoveOrderResponse,
  DeleteMoveOrderDocumentResponse,
  DeleteMoveOrderDocumentQuery,
  DeleteMoveOrderResponse,
  GetMoveOrderDocumentQuery,
  GetMoveOrderQuery,
  GetMoveOrderResponse,
  GetMoveOrderSettingsResponse,
  ListMoveOrderCommentsResponse,
  ListMoveOrdersQuery,
  ListMoveOrdersResponse,
  MarkMoveOrderAsCompletedQuery,
  MoveOrderAttachmentResponse,
  MoveOrderStatusResponse,
  UpdateMoveOrderRequest,
  UpdateMoveOrderQuery,
  UpdateMoveOrderResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export interface AddMoveOrderAttachmentRequest {
  attachment?: string
  doc?: string
  totalFiles?: number
  document_ids?: string
}

export class MoveOrders {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListMoveOrdersQuery): Promise<ListMoveOrdersResponse['moveorders']> {
    const { moveorders } = await this.http.get<ListMoveOrdersResponse>({
      path: ['moveorders'],
      query: { ...params },
    })
    return moveorders
  }

  async create(
    data: CreateMoveOrderRequest,
    params?: CreateMoveOrderQuery
  ): Promise<CreateMoveOrderResponse['moveorder']> {
    const { moveorder } = await this.http.post<CreateMoveOrderResponse>({
      path: ['moveorders'],
      body: data,
      query: { ...params },
    })
    return moveorder
  }

  async bulkDelete(params?: ListMoveOrdersQuery): Promise<DeleteMoveOrderResponse> {
    return this.http.delete<DeleteMoveOrderResponse>({ path: ['moveorders'], query: { ...params } })
  }

  async get(
    moveorderId: string,
    params?: GetMoveOrderQuery
  ): Promise<GetMoveOrderResponse['moveorder']> {
    const { moveorder } = await this.http.get<GetMoveOrderResponse>({
      path: ['moveorders', moveorderId],
      query: { ...params },
    })
    return moveorder
  }

  async update(
    moveorderId: string,
    data: UpdateMoveOrderRequest,
    params?: UpdateMoveOrderQuery
  ): Promise<UpdateMoveOrderResponse['moveorder']> {
    const { moveorder } = await this.http.put<UpdateMoveOrderResponse>({
      path: ['moveorders', moveorderId],
      body: data,
      query: { ...params },
    })
    return moveorder
  }

  async delete(moveorderId: string): Promise<void> {
    await this.http.delete({ path: ['moveorders', moveorderId] })
  }

  async listComments(moveorderId: string): Promise<ListMoveOrderCommentsResponse['comments']> {
    const { comments } = await this.http.get<ListMoveOrderCommentsResponse>({
      path: ['moveorders', moveorderId, 'comments'],
    })
    return comments
  }

  async markAsConfirmed(moveorderId: string): Promise<MoveOrderStatusResponse> {
    return this.http.post<MoveOrderStatusResponse>({
      path: ['moveorders', moveorderId, 'markasconfirmed'],
    })
  }

  async markAsInProgress(moveorderId: string): Promise<MoveOrderStatusResponse> {
    return this.http.post<MoveOrderStatusResponse>({
      path: ['moveorders', moveorderId, 'markasinprogress'],
    })
  }

  async markAsCompleted(
    moveorderId: string,
    params: MarkMoveOrderAsCompletedQuery
  ): Promise<MoveOrderStatusResponse> {
    return this.http.post<MoveOrderStatusResponse>({
      path: ['moveorders', moveorderId, 'markascompleted'],
      query: params,
    })
  }

  async addAttachment(
    moveorderId: string,
    data: AddMoveOrderAttachmentRequest
  ): Promise<MoveOrderAttachmentResponse['document']> {
    const { document } = await this.http.post<MoveOrderAttachmentResponse>({
      path: ['moveorders', moveorderId, 'attachment'],
      body: data,
    })
    return document
  }

  async getDocument(
    moveorderId: string,
    documentId: string,
    params?: GetMoveOrderDocumentQuery
  ): Promise<string> {
    return this.http.get<string>({
      path: ['moveorders', moveorderId, 'documents', documentId],
      query: { ...params },
    })
  }

  async deleteDocument(
    moveorderId: string,
    documentId: string,
    params?: DeleteMoveOrderDocumentQuery
  ): Promise<DeleteMoveOrderDocumentResponse> {
    return this.http.delete<DeleteMoveOrderDocumentResponse>({
      path: ['moveorders', moveorderId, 'documents', documentId],
      query: { ...params },
    })
  }

  async getSettings(): Promise<GetMoveOrderSettingsResponse['moveorder_settings']> {
    const { moveorder_settings } = await this.http.get<GetMoveOrderSettingsResponse>({
      path: ['settings', 'moveorders'],
    })
    return moveorder_settings
  }
}
