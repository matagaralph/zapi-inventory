import type { ApiClient } from '../client';
import type {
  CreateRetainerinvoiceRequest,
  CreateRetainerinvoiceResponse,
  ListRetainerInvoicesResponse,
  UpdateRetainerinvoiceRequest,
  UpdateRetainerinvoiceResponse,
  GetRetainerInvoiceResponse,
  DeleteRetainerInvoiceResponse,
  MarkRetainerInvoiceAsSentResponse,
  UpdateRetainerInvoiceTemplateResponse,
  VoidRetainerInvoiceResponse,
  MarkAsDraftResponse,
  SubmitRetainerInvoiceForApprovalResponse,
  ApproveRetainerInvoiceResponse,
  EmailRetainerInvoiceRequest,
  EmailRetainerInvoiceResponse,
  GetRetainerInvoiceEmailContentResponse,
  UpdateBillingAddressRequest,
  UpdateBillingAddressResponse,
  ListRetainerInvoiceTemplatesResponse,
  GetRetainerInvoiceAttachmentResponse,
  AddAttachmentToRetainerInvoiceRequest,
  AddAttachmentToRetainerInvoiceResponse,
  DeleteAttachmentResponse,
  ListRetainerInvoiceCommentsAndHistoryResponse,
  AddCommentRequest,
  AddCommentResponse,
  DeleteCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from '../types/retainerinvoice';

export class RetainerInvoiceModule {
  constructor(private client: ApiClient) {}

  async list(opts?: {
    limit: number;
  }): Promise<ListRetainerInvoicesResponse['retainerinvoices']> {
    return this.client.getList({
      path: ['retainerinvoices'],
      limit: opts?.limit,
      extractor: (res: ListRetainerInvoicesResponse) =>
        res.retainerinvoices ?? [],
    });
  }

  async create(
    data: CreateRetainerinvoiceRequest,
    params?: { ignore_auto_number_generation?: boolean }
  ): Promise<CreateRetainerinvoiceResponse['retainerinvoice']> {
    const res = await this.client.post<CreateRetainerinvoiceResponse>({
      path: ['retainerinvoices'],
      params,
      body: data,
    });
    return res.retainerinvoice;
  }

  async get(
    retainerInvoiceId: string
  ): Promise<GetRetainerInvoiceResponse['retainerinvoice']> {
    const res = await this.client.get<GetRetainerInvoiceResponse>({
      path: ['retainerinvoices', retainerInvoiceId],
    });
    return res.retainerinvoice;
  }

  async update(
    retainerInvoiceId: string,
    data: UpdateRetainerinvoiceRequest
  ): Promise<UpdateRetainerinvoiceResponse['retainerinvoice']> {
    const res = await this.client.put<UpdateRetainerinvoiceResponse>({
      path: ['retainerinvoices', retainerInvoiceId],
      body: data,
    });
    return res.retainerinvoice;
  }

  async delete(
    retainerInvoiceId: string
  ): Promise<DeleteRetainerInvoiceResponse> {
    return this.client.delete({
      path: ['retainerinvoices', retainerInvoiceId],
    });
  }

  async markSent(
    retainerInvoiceId: string
  ): Promise<MarkRetainerInvoiceAsSentResponse> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'sent'],
    });
  }

  async markVoid(
    retainerInvoiceId: string
  ): Promise<VoidRetainerInvoiceResponse> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'void'],
    });
  }

  async markDraft(retainerInvoiceId: string): Promise<MarkAsDraftResponse> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'draft'],
    });
  }

  async submit(
    retainerInvoiceId: string
  ): Promise<SubmitRetainerInvoiceForApprovalResponse> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'submit'],
    });
  }

  async approve(
    retainerInvoiceId: string
  ): Promise<ApproveRetainerInvoiceResponse> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'approve'],
    });
  }

  async updateTemplate(
    retainerInvoiceId: string,
    templateId: string
  ): Promise<UpdateRetainerInvoiceTemplateResponse> {
    return this.client.put({
      path: ['retainerinvoices', retainerInvoiceId, 'templates', templateId],
    });
  }

  async getEmailContent(
    retainerInvoiceId: string
  ): Promise<GetRetainerInvoiceEmailContentResponse> {
    return this.client.get({
      path: ['retainerinvoices', retainerInvoiceId, 'email'],
    });
  }

  async email(
    retainerInvoiceId: string,
    data: EmailRetainerInvoiceRequest,
    params?: {
      send_customer_statement?: boolean;
      send_attachment?: boolean;
      attachments?: string;
    }
  ): Promise<EmailRetainerInvoiceResponse> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'email'],
      params,
      body: data,
    });
  }

  async updateBillingAddress(
    retainerInvoiceId: string,
    data: UpdateBillingAddressRequest
  ): Promise<UpdateBillingAddressResponse> {
    return this.client.put({
      path: ['retainerinvoices', retainerInvoiceId, 'address', 'billing'],
      body: data,
    });
  }

  async listTemplates(): Promise<
    ListRetainerInvoiceTemplatesResponse['templates']
  > {
    return this.client.getList({
      path: ['retainerinvoices', 'templates'],
      extractor: (res: ListRetainerInvoiceTemplatesResponse) =>
        res.templates ?? [],
    });
  }

  async getAttachment(
    retainerInvoiceId: string
  ): Promise<GetRetainerInvoiceAttachmentResponse> {
    return this.client.get({
      path: ['retainerinvoices', retainerInvoiceId, 'attachment'],
    });
  }

  async addAttachment(
    retainerInvoiceId: string,
    data: AddAttachmentToRetainerInvoiceRequest
  ): Promise<AddAttachmentToRetainerInvoiceResponse> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'attachment'],
      body: data,
    });
  }

  async deleteAttachment(
    retainerInvoiceId: string,
    documentId: string
  ): Promise<DeleteAttachmentResponse> {
    return this.client.delete({
      path: ['retainerinvoices', retainerInvoiceId, 'attachment', documentId],
    });
  }

  async listComments(
    retainerInvoiceId: string
  ): Promise<ListRetainerInvoiceCommentsAndHistoryResponse['comments']> {
    const res =
      await this.client.get<ListRetainerInvoiceCommentsAndHistoryResponse>({
        path: ['retainerinvoices', retainerInvoiceId, 'comments'],
      });
    return res.comments ?? [];
  }

  async addComment(
    retainerInvoiceId: string,
    data: AddCommentRequest
  ): Promise<AddCommentResponse> {
    return await this.client.post<AddCommentResponse>({
      path: ['retainerinvoices', retainerInvoiceId, 'comments'],
      body: data,
    });
  }

  async updateComment(
    retainerInvoiceId: string,
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<UpdateCommentResponse['comment']> {
    const res = await this.client.put<UpdateCommentResponse>({
      path: ['retainerinvoices', retainerInvoiceId, 'comments', commentId],
      body: data,
    });
    return res.comment;
  }

  async deleteComment(
    retainerInvoiceId: string,
    commentId: string
  ): Promise<DeleteCommentResponse> {
    return this.client.delete({
      path: ['retainerinvoices', retainerInvoiceId, 'comments', commentId],
    });
  }
}
