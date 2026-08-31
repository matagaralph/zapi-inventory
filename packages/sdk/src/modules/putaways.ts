import type {
  CreatePutawayRequest,
  CreatePutawayQuery,
  CreatePutawayResponse,
  DeletePutawayDocumentResponse,
  DeletePutawayDocumentQuery,
  GetPutawayDocumentQuery,
  GetPutawayQuery,
  GetPutawayResponse,
  GetPutawaySettingsResponse,
  ListPutawayCommentsResponse,
  ListPutawaysQuery,
  ListPutawaysResponse,
  PutawayAttachmentResponse,
  UpdatePutawayRequest,
  UpdatePutawayQuery,
  UpdatePutawayResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Putaways {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListPutawaysQuery): Promise<ListPutawaysResponse['putaways']> {
    const { putaways } = await this.http.get<ListPutawaysResponse>({
      path: ['putaways'],
      query: { ...params },
    })
    return putaways
  }

  async create(
    data: CreatePutawayRequest,
    params?: CreatePutawayQuery
  ): Promise<CreatePutawayResponse['putaway']> {
    const { putaway } = await this.http.post<CreatePutawayResponse>({
      path: ['putaways'],
      query: params,
      body: data,
    })
    return putaway
  }

  async get(putawayId: string, params?: GetPutawayQuery): Promise<GetPutawayResponse['putaway']> {
    const { putaway } = await this.http.get<GetPutawayResponse>({
      path: ['putaways', putawayId],
      query: { ...params },
    })
    return putaway
  }

  async update(
    putawayId: string,
    data: UpdatePutawayRequest,
    params?: UpdatePutawayQuery
  ): Promise<UpdatePutawayResponse['putaway']> {
    const { putaway } = await this.http.put<UpdatePutawayResponse>({
      path: ['putaways', putawayId],
      query: params,
      body: data,
    })
    return putaway
  }

  async delete(putawayId: string): Promise<void> {
    await this.http.delete({ path: ['putaways', putawayId] })
  }

  async listComments(putawayId: string): Promise<ListPutawayCommentsResponse['comments']> {
    const { comments } = await this.http.get<ListPutawayCommentsResponse>({
      path: ['putaways', putawayId, 'comments'],
    })
    return comments
  }

  async addAttachment(
    putawayId: string,
    attachment: Blob,
    documentIds?: string
  ): Promise<PutawayAttachmentResponse['document']> {
    const body = new FormData()
    body.append('attachment', attachment)
    if (documentIds !== undefined) body.append('document_ids', documentIds)
    const { document } = await this.http.post<PutawayAttachmentResponse>({
      path: ['putaways', putawayId, 'attachment'],
      body,
    })
    return document
  }

  async getDocument(
    putawayId: string,
    documentId: string,
    params?: GetPutawayDocumentQuery
  ): Promise<Blob> {
    return this.http.get<Blob>({
      path: ['putaways', putawayId, 'documents', documentId],
      query: { ...params },
    })
  }

  async deleteDocument(
    putawayId: string,
    documentId: string,
    params?: DeletePutawayDocumentQuery
  ): Promise<DeletePutawayDocumentResponse> {
    return this.http.delete<DeletePutawayDocumentResponse>({
      path: ['putaways', putawayId, 'documents', documentId],
      query: params,
    })
  }

  async getSettings(): Promise<GetPutawaySettingsResponse['putaway_settings']> {
    const { putaway_settings } = await this.http.get<GetPutawaySettingsResponse>({
      path: ['settings', 'putaways'],
    })
    return putaway_settings
  }
}
