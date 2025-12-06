import type { ApiClient } from '../client';
import type {
  AddAttachmentToInvoiceResponse,
  AddCommentResponse,
  ApplyCreditsRequest,
  ApplyCreditsResponse,
  BulkExportInvoicesResponse,
  BulkPrintInvoicesResponse,
  CancelWriteOffResponse,
  CreateCommentRequest,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  DeleteAppliedCreditResponse,
  DeleteAttachmentResponse,
  DeleteCommentResponse,
  DeleteInvoiceResponse,
  DeletePaymentResponse,
  DisablePaymentReminderResponse,
  EmailInvoiceRequest,
  EmailInvoiceResponse,
  EmailInvoicesResponse,
  EnablePaymentReminderResponse,
  GetInvoiceAttachmentResponse,
  GetInvoiceEmailContentResponse,
  GetInvoiceResponse,
  GetPaymentReminderMailContentResponse,
  ListCreditsAppliedResponse,
  ListInvoiceCommentsAndHistoryResponse,
  ListInvoicePaymentsResponse,
  ListInvoicesResponse,
  ListInvoiceTemplatesResponse,
  MarkAsDraftResponse,
  MarkInvoiceAsSentResponse,
  UpdateAttachmentPreferenceResponse,
  UpdateBillingAddressRequest,
  UpdateBillingAddressResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
  UpdateInvoiceCustomfieldResponse,
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
  UpdateInvoiceTemplateResponse,
  UpdateShippingAddressRequest,
  UpdateShippingAddressResponse,
  VoidInvoiceResponse,
  WriteOffInvoiceResponse,
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

  async delete(invoiceId: string): Promise<DeleteInvoiceResponse> {
    return this.client.delete({
      path: ['invoices', invoiceId],
    });
  }

  async updateCustomFields(
    invoiceId: string,
    data: Record<string, any>
  ): Promise<UpdateInvoiceCustomfieldResponse> {
    return this.client.put({
      path: ['invoice', invoiceId, 'customfields'],
      body: data,
    });
  }

  async markSent(invoiceId: string): Promise<MarkInvoiceAsSentResponse> {
    return this.client.post({
      path: ['invoices', invoiceId, 'status', 'sent'],
    });
  }

  async markVoid(invoiceId: string): Promise<VoidInvoiceResponse> {
    return this.client.post({
      path: ['invoices', invoiceId, 'status', 'void'],
    });
  }

  async markDraft(invoiceId: string): Promise<MarkAsDraftResponse> {
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

  async email(
    invoiceId: string,
    data: EmailInvoiceRequest,
    params?: {
      send_customer_statement?: boolean;
      send_attachment?: boolean;
      attachments?: string;
    }
  ): Promise<EmailInvoiceResponse> {
    return this.client.post({
      path: ['invoices', invoiceId, 'email'],
      params,
      body: data,
    });
  }

  async emailBulk(params: {
    invoice_ids: string;
  }): Promise<EmailInvoicesResponse> {
    return this.client.post({
      path: ['invoices', 'email'],
      params,
    });
  }

  async getReminderMailContent(
    invoiceId: string
  ): Promise<GetPaymentReminderMailContentResponse> {
    return this.client.get({
      path: ['invoices', invoiceId, 'paymentreminder'],
    });
  }

  async disablePaymentReminder(
    invoiceId: string
  ): Promise<DisablePaymentReminderResponse> {
    return this.client.post({
      path: ['invoices', invoiceId, 'paymentreminder', 'disable'],
    });
  }

  async enablePaymentReminder(
    invoiceId: string
  ): Promise<EnablePaymentReminderResponse> {
    return this.client.post({
      path: ['invoices', invoiceId, 'paymentreminder', 'enable'],
    });
  }

  async writeOff(invoiceId: string): Promise<WriteOffInvoiceResponse> {
    return this.client.post({
      path: ['invoices', invoiceId, 'writeoff'],
    });
  }

  async cancelWriteOff(invoiceId: string): Promise<CancelWriteOffResponse> {
    return this.client.post({
      path: ['invoices', invoiceId, 'writeoff', 'cancel'],
    });
  }

  async updateBillingAddress(
    invoiceId: string,
    data: UpdateBillingAddressRequest
  ): Promise<UpdateBillingAddressResponse> {
    return this.client.put({
      path: ['invoices', invoiceId, 'address', 'billing'],
      body: data,
    });
  }

  async updateShippingAddress(
    invoiceId: string,
    data: UpdateShippingAddressRequest
  ): Promise<UpdateShippingAddressResponse> {
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

  async updateTemplate(
    invoiceId: string,
    templateId: string
  ): Promise<UpdateInvoiceTemplateResponse> {
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

  async deletePayment(
    invoiceId: string,
    paymentId: string
  ): Promise<DeletePaymentResponse> {
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

  async applyCredits(
    invoiceId: string,
    data: ApplyCreditsRequest
  ): Promise<ApplyCreditsResponse> {
    return this.client.post({
      path: ['invoices', invoiceId, 'credits'],
      body: data,
    });
  }

  async deleteAppliedCredit(
    invoiceId: string,
    appliedCreditId: string
  ): Promise<DeleteAppliedCreditResponse> {
    return this.client.delete({
      path: ['invoices', invoiceId, 'creditsapplied', appliedCreditId],
    });
  }

  async getAttachment(
    invoiceId: string,
    params?: { preview?: boolean }
  ): Promise<GetInvoiceAttachmentResponse> {
    return this.client.get({
      path: ['invoices', invoiceId, 'attachment'],
      params,
    });
  }

  async updateAttachmentPreference(
    invoiceId: string,
    params: { can_send_in_mail: boolean }
  ): Promise<UpdateAttachmentPreferenceResponse> {
    return this.client.put({
      path: ['invoices', invoiceId, 'attachment'],
      params,
    });
  }

  async addAttachment(
    invoiceId: string,
    params: { can_send_in_mail?: boolean; attachment?: string }
  ): Promise<AddAttachmentToInvoiceResponse> {
    return this.client.post({
      path: ['invoices', invoiceId, 'attachment'],
      params,
    });
  }

  async deleteAttachment(invoiceId: string): Promise<DeleteAttachmentResponse> {
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

  async addComment(
    invoiceId: string,
    data: CreateCommentRequest
  ): Promise<AddCommentResponse> {
    const res = await this.client.post<AddCommentResponse>({
      path: ['invoices', invoiceId, 'comments'],
      body: data,
    });
    return res;
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

  async deleteComment(
    invoiceId: string,
    commentId: string
  ): Promise<DeleteCommentResponse> {
    return this.client.delete({
      path: ['invoices', invoiceId, 'comments', commentId],
    });
  }

  async bulkExport(params: {
    invoice_ids: string;
  }): Promise<BulkExportInvoicesResponse> {
    return this.client.get({
      path: ['invoices', 'pdf'],
      params,
    });
  }

  async bulkPrint(params: {
    invoice_ids: string;
  }): Promise<BulkPrintInvoicesResponse> {
    return this.client.get({
      path: ['invoices', 'print'],
      params,
    });
  }
}
