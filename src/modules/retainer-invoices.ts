import type { ApiClient } from '../client';
import type {
  CreateRetainerinvoiceRequest,
  CreateRetainerinvoiceResponse,
  ListRetainerInvoicesResponse,
  UpdateRetainerinvoiceRequest,
  UpdateRetainerinvoiceResponse,
  GetRetainerInvoiceResponse,
  EmailRetainerInvoiceRequest,
  GetRetainerInvoiceEmailContentResponse,
  UpdateBillingAddressRequest,
  ListRetainerInvoiceTemplatesResponse,
  AddAttachmentToRetainerInvoiceRequest,
  ListRetainerInvoiceCommentsAndHistoryResponse,
  AddCommentRequest,
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

  delete(retainerInvoiceId: string): Promise<void> {
    return this.client.delete({
      path: ['retainerinvoices', retainerInvoiceId],
    });
  }

  markSent(retainerInvoiceId: string): Promise<void> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'sent'],
    });
  }

  markVoid(retainerInvoiceId: string): Promise<void> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'void'],
    });
  }

  markDraft(retainerInvoiceId: string): Promise<void> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'draft'],
    });
  }

  submit(retainerInvoiceId: string): Promise<void> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'submit'],
    });
  }

  approve(retainerInvoiceId: string): Promise<void> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'approve'],
    });
  }

  updateTemplate(retainerInvoiceId: string, templateId: string): Promise<void> {
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

  email(
    retainerInvoiceId: string,
    data: EmailRetainerInvoiceRequest,
    opts?: {
      send_customer_statement?: boolean;
      send_attachment?: boolean;
      attachments?: string;
    }
  ): Promise<void> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'email'],
      params: opts,
      body: data,
    });
  }

  updateBillingAddress(
    retainerInvoiceId: string,
    data: UpdateBillingAddressRequest
  ): Promise<void> {
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

  getAttachment(retainerInvoiceId: string): Promise<void> {
    return this.client.get({
      path: ['retainerinvoices', retainerInvoiceId, 'attachment'],
    });
  }

  addAttachment(
    retainerInvoiceId: string,
    data: AddAttachmentToRetainerInvoiceRequest
  ): Promise<void> {
    return this.client.post({
      path: ['retainerinvoices', retainerInvoiceId, 'attachment'],
      body: data,
    });
  }

  deleteAttachment(
    retainerInvoiceId: string,
    documentId: string
  ): Promise<void> {
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

  addComment(
    retainerInvoiceId: string,
    data: AddCommentRequest
  ): Promise<void> {
    return this.client.post({
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

  deleteComment(retainerInvoiceId: string, commentId: string): Promise<void> {
    return this.client.delete({
      path: ['retainerinvoices', retainerInvoiceId, 'comments', commentId],
    });
  }
}
