import type { ApiClient } from '../client';
import type {
  ApplyCreditsRequest,
  CreateCommentRequest,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  EmailInvoiceRequest,
  GetInvoiceEmailContentResponse,
  GetInvoiceResponse,
  GetPaymentReminderMailContentResponse,
  ListCreditsAppliedResponse,
  ListInvoiceCommentsAndHistoryResponse,
  ListInvoicePaymentsResponse,
  ListInvoicesResponse,
  ListInvoiceTemplatesResponse,
  UpdateBillingAddressRequest,
  UpdateCommentRequest,
  UpdateCommentResponse,
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
  UpdateShippingAddressRequest,
} from '../types/invoice';

export class InvoiceModule {
  constructor(private client: ApiClient) {}

  async list(opts?: {
    limit: number;
  }): Promise<ListInvoicesResponse['invoices']> {
    return this.client.getList({
      path: ['invoices'],
      limit: opts?.limit,
      extractor: (res: ListInvoicesResponse) => res.invoices ?? [],
    });
  }

  async create(
    data: CreateInvoiceRequest,
    params?: { send?: boolean; ignore_auto_number_generation?: boolean }
  ): Promise<CreateInvoiceResponse['invoice']> {
    const res = await this.client.post<CreateInvoiceResponse>({
      path: ['invoices'],
      params,
      body: data,
    });
    return res.invoice;
  }

  async get(
    invoiceId: string,
    params?: { print?: boolean; accept?: string }
  ): Promise<GetInvoiceResponse['invoice']> {
    const res = await this.client.get<GetInvoiceResponse>({
      path: ['invoices', invoiceId],
      params,
    });
    return res.invoice;
  }

  async update(
    invoiceId: string,
    data: UpdateInvoiceRequest,
    ignoreAutoNumberGeneration?: boolean
  ): Promise<UpdateInvoiceResponse['invoice']> {
    const params = ignoreAutoNumberGeneration
      ? { ignore_auto_number_generation: true }
      : undefined;

    const res = await this.client.put<UpdateInvoiceResponse>({
      path: ['invoices', invoiceId],
      params,
      body: data,
    });

    return res.invoice;
  }

  delete(invoiceId: string): Promise<void> {
    return this.client.delete({
      path: ['invoices', invoiceId],
    });
  }

  updateCustomFields(
    invoiceId: string,
    data: Record<string, any>
  ): Promise<void> {
    return this.client.put({
      path: ['invoice', invoiceId, 'customfields'],
      body: data,
    });
  }

  markSent(invoiceId: string): Promise<void> {
    return this.client.post({
      path: ['invoices', invoiceId, 'status', 'sent'],
    });
  }

  markVoid(invoiceId: string): Promise<void> {
    return this.client.post({
      path: ['invoices', invoiceId, 'status', 'void'],
    });
  }

  markDraft(invoiceId: string): Promise<void> {
    return this.client.post({
      path: ['invoices', invoiceId, 'status', 'draft'],
    });
  }

  async getEmailContent(
    invoiceId: string,
    emailTemplateId?: string
  ): Promise<GetInvoiceEmailContentResponse> {
    return this.client.get({
      path: ['invoices', invoiceId, 'email'],
      params: emailTemplateId
        ? { email_template_id: emailTemplateId }
        : undefined,
    });
  }

  email(
    invoiceId: string,
    data: EmailInvoiceRequest,
    opts?: {
      send_customer_statement?: boolean;
      send_attachment?: boolean;
      attachments?: string;
    }
  ): Promise<void> {
    return this.client.post({
      path: ['invoices', invoiceId, 'email'],
      params: opts,
      body: data,
    });
  }

  emailBulk(opts?: { invoice_ids: string }): Promise<void> {
    return this.client.post({
      path: ['invoices', 'email'],
      params: opts,
    });
  }

  async getReminderMailContent(
    invoiceId: string
  ): Promise<GetPaymentReminderMailContentResponse> {
    return this.client.get({
      path: ['invoices', invoiceId, 'paymentreminder'],
    });
  }

  disablePaymentReminder(invoiceId: string): Promise<void> {
    return this.client.post({
      path: ['invoices', invoiceId, 'paymentreminder', 'disable'],
    });
  }

  enablePaymentReminder(invoiceId: string): Promise<void> {
    return this.client.post({
      path: ['invoices', invoiceId, 'paymentreminder', 'enable'],
    });
  }

  writeOff(invoiceId: string): Promise<void> {
    return this.client.post({
      path: ['invoices', invoiceId, 'writeoff'],
    });
  }

  cancelWriteOff(invoiceId: string): Promise<void> {
    return this.client.post({
      path: ['invoices', invoiceId, 'writeoff', 'cancel'],
    });
  }

  updateBillingAddress(
    invoiceId: string,
    data: UpdateBillingAddressRequest
  ): Promise<void> {
    return this.client.put({
      path: ['invoices', invoiceId, 'address', 'billing'],
      body: data,
    });
  }

  updateShippingAddress(
    invoiceId: string,
    data: UpdateShippingAddressRequest
  ): Promise<void> {
    return this.client.put({
      path: ['invoices', invoiceId, 'address', 'shipping'],
      body: data,
    });
  }

  async listTemplates(): Promise<ListInvoiceTemplatesResponse['templates']> {
    return this.client.getList({
      path: ['invoices', 'templates'],
      extractor: (res: ListInvoiceTemplatesResponse) => res.templates ?? [],
    });
  }

  updateTemplate(invoiceId: string, templateId: string): Promise<void> {
    return this.client.put({
      path: ['invoices', invoiceId, 'templates', templateId],
    });
  }

  async listPayments(
    invoiceId: string
  ): Promise<ListInvoicePaymentsResponse['payments']> {
    const res = await this.client.get<ListInvoicePaymentsResponse>({
      path: ['invoices', invoiceId, 'payments'],
    });
    return res.payments ?? [];
  }

  deletePayment(invoiceId: string, paymentId: string): Promise<void> {
    return this.client.delete({
      path: ['invoices', invoiceId, 'payments', paymentId],
    });
  }

  async listCreditsApplied(
    invoiceId: string
  ): Promise<ListCreditsAppliedResponse['credits']> {
    const res = await this.client.get<ListCreditsAppliedResponse>({
      path: ['invoices', invoiceId, 'creditsapplied'],
    });
    return res.credits ?? [];
  }

  applyCredits(invoiceId: string, data: ApplyCreditsRequest): Promise<void> {
    return this.client.post({
      path: ['invoices', invoiceId, 'credits'],
      body: data,
    });
  }

  deleteAppliedCredit(
    invoiceId: string,
    appliedCreditId: string
  ): Promise<void> {
    return this.client.delete({
      path: ['invoices', invoiceId, 'creditsapplied', appliedCreditId],
    });
  }

  getAttachment(
    invoiceId: string,
    opts?: { preview?: boolean }
  ): Promise<void> {
    return this.client.get({
      path: ['invoices', invoiceId, 'attachment'],
      params: opts,
    });
  }

  updateAttachmentPreference(
    invoiceId: string,
    opts?: { can_send_in_mail: boolean }
  ): Promise<void> {
    return this.client.put({
      path: ['invoices', invoiceId, 'attachment'],
      params: opts,
    });
  }

  addAttachment(
    invoiceId: string,
    opts?: { can_send_in_mail?: boolean; attachment?: string }
  ): Promise<void> {
    return this.client.post({
      path: ['invoices', invoiceId, 'attachment'],
      params: opts,
    });
  }

  deleteAttachment(invoiceId: string): Promise<void> {
    return this.client.delete({
      path: ['invoices', invoiceId, 'attachment'],
    });
  }

  async listComments(
    invoiceId: string
  ): Promise<ListInvoiceCommentsAndHistoryResponse['comments']> {
    const res = await this.client.get<ListInvoiceCommentsAndHistoryResponse>({
      path: ['invoices', invoiceId, 'comments'],
    });
    return res.comments ?? [];
  }

  addComment(invoiceId: string, data: CreateCommentRequest): Promise<void> {
    return this.client.post({
      path: ['invoices', invoiceId, 'comments'],
      body: data,
    });
  }

  async updateComment(
    invoiceId: string,
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<UpdateCommentResponse> {
    const res = await this.client.put<UpdateCommentResponse>({
      path: ['invoices', invoiceId, 'comments', commentId],
      body: data,
    });
    return res;
  }

  deleteComment(invoiceId: string, commentId: string): Promise<void> {
    return this.client.delete({
      path: ['invoices', invoiceId, 'comments', commentId],
    });
  }

  bulkExport(params: { invoice_ids: string }): Promise<void> {
    return this.client.get({
      path: ['invoices', 'pdf'],
      params,
    });
  }

  bulkPrint(params: { invoice_ids: string }): Promise<void> {
    return this.client.get({
      path: ['invoices', 'print'],
      params,
    });
  }
}
