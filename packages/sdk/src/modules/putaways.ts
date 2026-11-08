import type {
  CreatePutawayRequest,
  CreatePutawayQuery,
  CreatePutawayResponse,
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

/**
 * Putaways let you record stock moved into storage locations after inbound operations. Use these APIs to create, update, list, and delete putaway transactions in Zoho Inventory.
 */
export function createPutaways(http: HTTPClient) {
  return {
    async list(params?: ListPutawaysQuery): Promise<ListPutawaysResponse['putaways']> {
      const { putaways } = await http.get<ListPutawaysResponse>({
        path: ['putaways'],
        query: { ...params },
      })
      return putaways
    },

    async create(
      data: CreatePutawayRequest,
      params?: CreatePutawayQuery
    ): Promise<CreatePutawayResponse['putaway']> {
      const { putaway } = await http.post<CreatePutawayResponse>({
        path: ['putaways'],
        query: params,
        body: data,
      })
      return putaway
    },

    async get(putawayId: string, params?: GetPutawayQuery): Promise<GetPutawayResponse['putaway']> {
      const { putaway } = await http.get<GetPutawayResponse>({
        path: ['putaways', putawayId],
        query: { ...params },
      })
      return putaway
    },

    async update(
      putawayId: string,
      data: UpdatePutawayRequest,
      params?: UpdatePutawayQuery
    ): Promise<UpdatePutawayResponse['putaway']> {
      const { putaway } = await http.put<UpdatePutawayResponse>({
        path: ['putaways', putawayId],
        query: params,
        body: data,
      })
      return putaway
    },

    async delete(putawayId: string): Promise<void> {
      await http.delete({ path: ['putaways', putawayId] })
    },

    async listComments(putawayId: string): Promise<ListPutawayCommentsResponse['comments']> {
      const { comments } = await http.get<ListPutawayCommentsResponse>({
        path: ['putaways', putawayId, 'comments'],
      })
      return comments
    },

    async addAttachment(
      putawayId: string,
      attachment: Blob,
      documentIds?: string
    ): Promise<PutawayAttachmentResponse['document']> {
      const body = new FormData()
      body.append('attachment', attachment)
      if (documentIds !== undefined) body.append('document_ids', documentIds)
      const { document } = await http.post<PutawayAttachmentResponse>({
        path: ['putaways', putawayId, 'attachment'],
        body,
      })
      return document
    },

    async getDocument(
      putawayId: string,
      documentId: string,
      params?: GetPutawayDocumentQuery
    ): Promise<Blob> {
      return http.get<Blob>({
        path: ['putaways', putawayId, 'documents', documentId],
        query: { ...params },
      })
    },

    async deleteDocument(
      putawayId: string,
      documentId: string,
      params?: DeletePutawayDocumentQuery
    ): Promise<void> {
      await http.delete({
        path: ['putaways', putawayId, 'documents', documentId],
        query: params,
      })
    },

    async getSettings(): Promise<GetPutawaySettingsResponse['putaway_settings']> {
      const { putaway_settings } = await http.get<GetPutawaySettingsResponse>({
        path: ['settings', 'putaways'],
      })
      return putaway_settings
    },
  }
}

export type Putaways = ReturnType<typeof createPutaways>
