import type {
  ApproveRetainerInvoiceResponse,
  CreateRetainerinvoiceRequest,
  CreateRetainerinvoiceResponse,
  EmailRetainerInvoiceRequest,
  EmailRetainerInvoiceResponse,
  GetRetainerInvoiceAttachmentResponse,
  GetRetainerInvoiceEmailContentResponse,
  GetRetainerInvoiceResponse,
  AddAttachmentToRetainerInvoiceRequest,
  AddAttachmentToRetainerInvoiceResponse,
  ListRetainerInvoiceCommentsAndHistoryResponse,
  ListRetainerInvoiceTemplatesResponse,
  ListRetainerInvoicesResponse,
  MarkRetainerInvoiceAsSentResponse,
  RetainerInvoicesAddCommentRequest,
  RetainerInvoicesAddCommentResponse,
  RetainerInvoicesDeleteAttachmentResponse,
  RetainerInvoicesDeleteCommentResponse,
  RetainerInvoicesMarkAsDraftResponse,
  RetainerInvoicesUpdateBillingAddressRequest,
  RetainerInvoicesUpdateBillingAddressResponse,
  RetainerInvoicesUpdateCommentRequest,
  RetainerInvoicesUpdateCommentResponse,
  SubmitRetainerInvoiceForApprovalResponse,
  UpdateRetainerinvoiceRequest,
  UpdateRetainerinvoiceResponse,
  UpdateRetainerInvoiceTemplateResponse,
  VoidRetainerInvoiceResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class RetainerInvoices {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListRetainerInvoicesResponse['retainerinvoices']> {
    const { retainerinvoices } = await this.http.get<ListRetainerInvoicesResponse>({
      path: ['retainerinvoices'],
      query: params,
    })
    return retainerinvoices
  }

  async create(
    data: CreateRetainerinvoiceRequest,
    ignoreAutoNumberGeneration?: boolean
  ): Promise<CreateRetainerinvoiceResponse['retainerinvoice']> {
    const { retainerinvoice } = await this.http.post<CreateRetainerinvoiceResponse>({
      path: ['retainerinvoices'],
      body: data,
      query: { ignore_auto_number_generation: ignoreAutoNumberGeneration },
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

  async markAsSent(retainerinvoiceId: string): Promise<MarkRetainerInvoiceAsSentResponse> {
    return this.http.post<MarkRetainerInvoiceAsSentResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'status', 'sent'],
    })
  }

  async updateTemplate(
    retainerinvoiceId: string,
    templateId: string
  ): Promise<UpdateRetainerInvoiceTemplateResponse> {
    return this.http.put<UpdateRetainerInvoiceTemplateResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'templates', templateId],
    })
  }

  async markAsVoid(retainerinvoiceId: string): Promise<VoidRetainerInvoiceResponse> {
    return this.http.post<VoidRetainerInvoiceResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'status', 'void'],
    })
  }

  async markAsDraft(retainerinvoiceId: string): Promise<RetainerInvoicesMarkAsDraftResponse> {
    return this.http.post<RetainerInvoicesMarkAsDraftResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'status', 'draft'],
    })
  }

  async submitForApproval(
    retainerinvoiceId: string
  ): Promise<SubmitRetainerInvoiceForApprovalResponse> {
    return this.http.post<SubmitRetainerInvoiceForApprovalResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'submit'],
    })
  }

  async approve(retainerinvoiceId: string): Promise<ApproveRetainerInvoiceResponse> {
    return this.http.post<ApproveRetainerInvoiceResponse>({
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
    query?: {
      send_customer_statement?: boolean
      send_attachment?: boolean
      attachments?: string
    }
  ): Promise<EmailRetainerInvoiceResponse> {
    return this.http.post<EmailRetainerInvoiceResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'email'],
      body: data,
      query,
    })
  }

  async updateBillingAddress(
    retainerinvoiceId: string,
    data: RetainerInvoicesUpdateBillingAddressRequest
  ): Promise<RetainerInvoicesUpdateBillingAddressResponse> {
    return this.http.put<RetainerInvoicesUpdateBillingAddressResponse>({
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

  async getAttachment(retainerinvoiceId: string): Promise<GetRetainerInvoiceAttachmentResponse> {
    return this.http.get<GetRetainerInvoiceAttachmentResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'attachment'],
    })
  }

  async addAttachment(
    retainerinvoiceId: string,
    data: AddAttachmentToRetainerInvoiceRequest
  ): Promise<AddAttachmentToRetainerInvoiceResponse> {
    return this.http.post<AddAttachmentToRetainerInvoiceResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'attachment'],
      body: data,
    })
  }

  async deleteAttachment(
    retainerinvoiceId: string,
    documentId: string
  ): Promise<RetainerInvoicesDeleteAttachmentResponse> {
    return this.http.delete<RetainerInvoicesDeleteAttachmentResponse>({
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
  ): Promise<RetainerInvoicesAddCommentResponse> {
    return this.http.post<RetainerInvoicesAddCommentResponse>({
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

  async deleteComment(
    retainerinvoiceId: string,
    commentId: string
  ): Promise<RetainerInvoicesDeleteCommentResponse> {
    return this.http.delete<RetainerInvoicesDeleteCommentResponse>({
      path: ['retainerinvoices', retainerinvoiceId, 'comments', commentId],
    })
  }
}
