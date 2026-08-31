import type {
  CreateRetainerInvoiceQuery,
  CreateRetainerinvoiceRequest,
  CreateRetainerinvoiceResponse,
  EmailRetainerInvoiceQuery,
  EmailRetainerInvoiceRequest,
  GetRetainerInvoiceEmailContentResponse,
  GetRetainerInvoiceResponse,
  AddAttachmentToRetainerInvoiceRequest,
  ListRetainerInvoiceCommentsAndHistoryResponse,
  ListRetainerInvoiceTemplatesResponse,
  ListRetainerInvoicesQuery,
  ListRetainerInvoicesResponse,
  RetainerInvoicesAddCommentRequest,
  RetainerInvoicesUpdateBillingAddressRequest,
  RetainerInvoicesUpdateCommentRequest,
  RetainerInvoicesUpdateCommentResponse,
  UpdateRetainerinvoiceRequest,
  UpdateRetainerinvoiceResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class RetainerInvoices {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: ListRetainerInvoicesQuery
  ): Promise<ListRetainerInvoicesResponse['retainerinvoices']> {
    const { retainerinvoices } = await this.http.get<ListRetainerInvoicesResponse>({
      path: ['retainerinvoices'],
      query: params,
    })
    return retainerinvoices
  }

  async create(
    data: CreateRetainerinvoiceRequest,
    params?: CreateRetainerInvoiceQuery
  ): Promise<CreateRetainerinvoiceResponse['retainerinvoice']> {
    const { retainerinvoice } = await this.http.post<CreateRetainerinvoiceResponse>({
      path: ['retainerinvoices'],
      body: data,
      query: params,
    })
    return retainerinvoice
  }

  async get(retainerinvoiceId: string): Promise<GetRetainerInvoiceResponse['retainerinvoice']> {
    const { retainerinvoice } = await this.http.get<GetRetainerInvoiceResponse>({
      path: ['retainerinvoices', retainerinvoiceId],
    })
    return retainerinvoice
  }

  async update(
    retainerinvoiceId: string,
    data: UpdateRetainerinvoiceRequest
  ): Promise<UpdateRetainerinvoiceResponse['retainerinvoice']> {
    const { retainerinvoice } = await this.http.put<UpdateRetainerinvoiceResponse>({
      path: ['retainerinvoices', retainerinvoiceId],
      body: data,
    })
    return retainerinvoice
  }

  async delete(retainerinvoiceId: string): Promise<void> {
    await this.http.delete({ path: ['retainerinvoices', retainerinvoiceId] })
  }

  async markAsSent(retainerinvoiceId: string): Promise<void> {
    await this.http.post({
      path: ['retainerinvoices', retainerinvoiceId, 'status', 'sent'],
    })
  }

  async updateTemplate(retainerinvoiceId: string, templateId: string): Promise<void> {
    await this.http.put({
      path: ['retainerinvoices', retainerinvoiceId, 'templates', templateId],
    })
  }

  async markAsVoid(retainerinvoiceId: string): Promise<void> {
    await this.http.post({
      path: ['retainerinvoices', retainerinvoiceId, 'status', 'void'],
    })
  }

  async markAsDraft(retainerinvoiceId: string): Promise<void> {
    await this.http.post({
      path: ['retainerinvoices', retainerinvoiceId, 'status', 'draft'],
    })
  }

  async submitForApproval(retainerinvoiceId: string): Promise<void> {
    await this.http.post({
      path: ['retainerinvoices', retainerinvoiceId, 'submit'],
    })
  }

  async approve(retainerinvoiceId: string): Promise<void> {
    await this.http.post({
      path: ['retainerinvoices', retainerinvoiceId, 'approve'],
    })
  }

  async getEmailContent(
    retainerinvoiceId: string
  ): Promise<GetRetainerInvoiceEmailContentResponse> {
    return this.http.get<GetRetainerInvoiceEmailContentResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'email'],
    })
  }

  async email(
    retainerinvoiceId: string,
    data?: EmailRetainerInvoiceRequest,
    query?: EmailRetainerInvoiceQuery
  ): Promise<void> {
    await this.http.post({
      path: ['retainerinvoices', retainerinvoiceId, 'email'],
      body: data,
      query,
    })
  }

  async updateBillingAddress(
    retainerinvoiceId: string,
    data: RetainerInvoicesUpdateBillingAddressRequest
  ): Promise<void> {
    await this.http.put({
      path: ['retainerinvoices', retainerinvoiceId, 'address', 'billing'],
      body: data,
    })
  }

  async listTemplates(): Promise<ListRetainerInvoiceTemplatesResponse['templates']> {
    const { templates } = await this.http.get<ListRetainerInvoiceTemplatesResponse>({
      path: ['retainerinvoices', 'templates'],
    })
    return templates
  }

  async getAttachment(retainerinvoiceId: string): Promise<void> {
    await this.http.get({
      path: ['retainerinvoices', retainerinvoiceId, 'attachment'],
    })
  }

  async addAttachment(
    retainerinvoiceId: string,
    data: AddAttachmentToRetainerInvoiceRequest
  ): Promise<void> {
    await this.http.post({
      path: ['retainerinvoices', retainerinvoiceId, 'attachment'],
      body: data,
    })
  }

  async deleteAttachment(retainerinvoiceId: string, documentId: string): Promise<void> {
    await this.http.delete({
      path: ['retainerinvoices', retainerinvoiceId, 'documents', documentId],
    })
  }

  async listComments(
    retainerinvoiceId: string
  ): Promise<ListRetainerInvoiceCommentsAndHistoryResponse['comments']> {
    const { comments } = await this.http.get<ListRetainerInvoiceCommentsAndHistoryResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'comments'],
    })
    return comments
  }

  async addComment(
    retainerinvoiceId: string,
    data: RetainerInvoicesAddCommentRequest
  ): Promise<void> {
    await this.http.post({
      path: ['retainerinvoices', retainerinvoiceId, 'comments'],
      body: data,
    })
  }

  async updateComment(
    retainerinvoiceId: string,
    commentId: string,
    data: RetainerInvoicesUpdateCommentRequest
  ): Promise<RetainerInvoicesUpdateCommentResponse> {
    return this.http.put<RetainerInvoicesUpdateCommentResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'comments', commentId],
      body: data,
    })
  }

  async deleteComment(retainerinvoiceId: string, commentId: string): Promise<void> {
    await this.http.delete({
      path: ['retainerinvoices', retainerinvoiceId, 'comments', commentId],
    })
  }
}
