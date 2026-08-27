import type {
  AddAttachmentToInvoiceQuery,
  ApplyCreditsRequest,
  ApplyCreditsResponse,
  BulkApproveInvoicesQuery,
  BulkExportInvoicesResponse,
  BulkPrintInvoicesQuery,
  BulkPrintInvoicesResponse,
  BulkSubmitInvoicesQuery,
  CancelWriteOffResponse,
  CreateInvoiceQuery,
  CreateCommentRequest,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  DisablePaymentReminderResponse,
  EmailInvoiceQuery,
  EmailInvoiceRequest,
  EmailInvoiceResponse,
  EmailInvoicesQuery,
  EmailInvoicesResponse,
  EnablePaymentReminderResponse,
  GetInvoiceAttachmentQuery,
  GetInvoiceEmailContentQuery,
  GetInvoiceQuery,
  GetInvoiceAttachmentResponse,
  GetInvoiceEmailContentResponse,
  GetInvoiceResponse,
  GetPaymentReminderMailContentResponse,
  AddAttachmentToInvoiceResponse,
  InvoicesAddCommentResponse,
  InvoicesApprovalActionResponse,
  InvoicesRejectRequest,
  InvoicesUpdateBillingAddressRequest,
  InvoicesUpdateBillingAddressResponse,
  InvoicesUpdateShippingAddressRequest,
  InvoicesUpdateShippingAddressResponse,
  ListCreditsAppliedResponse,
  ListInvoiceCommentsAndHistoryResponse,
  ListInvoicePaymentsResponse,
  ListInvoiceTemplatesResponse,
  ListInvoicesQuery,
  ListInvoicesResponse,
  MarkAsDraftResponse,
  MarkInvoiceAsSentResponse,
  UpdateInvoiceAttachmentQuery,
  UpdateAttachmentPreferenceResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
  UpdateInvoiceCustomfieldResponse,
  UpdateInvoiceQuery,
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
  UpdateInvoiceTemplateResponse,
  VoidInvoiceResponse,
  WriteOffInvoiceResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Invoices {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListInvoicesQuery): Promise<ListInvoicesResponse['invoices']> {
    const { invoices } = await this.http.get<ListInvoicesResponse>({
      path: ['invoices'],
      query: { ...params },
    })
    return invoices
  }

  async create(
    data: CreateInvoiceRequest,
    params?: CreateInvoiceQuery
  ): Promise<CreateInvoiceResponse['invoice']> {
    const { invoice } = await this.http.post<CreateInvoiceResponse>({
      path: ['invoices'],
      query: { ...params },
      body: data,
    })
    return invoice
  }

  async get(invoiceId: string, params?: GetInvoiceQuery): Promise<GetInvoiceResponse['invoice']> {
    const { invoice } = await this.http.get<GetInvoiceResponse>({
      path: ['invoices', invoiceId],
      query: { ...params },
    })
    return invoice
  }

  async update(
    invoiceId: string,
    data: UpdateInvoiceRequest,
    params?: UpdateInvoiceQuery
  ): Promise<UpdateInvoiceResponse['invoice']> {
    const { invoice } = await this.http.put<UpdateInvoiceResponse>({
      path: ['invoices', invoiceId],
      query: { ...params },
      body: data,
    })
    return invoice
  }

  async delete(invoiceId: string): Promise<void> {
    await this.http.delete({ path: ['invoices', invoiceId] })
  }

  async updateCustomField(
    invoiceId: string,
    data: { customfield_id?: string; value?: unknown }[]
  ): Promise<UpdateInvoiceCustomfieldResponse> {
    return this.http.put<UpdateInvoiceCustomfieldResponse>({
      path: ['invoice', invoiceId, 'customfields'],
      body: data,
    })
  }

  async markAsSent(invoiceId: string): Promise<MarkInvoiceAsSentResponse> {
    return this.http.post<MarkInvoiceAsSentResponse>({
      path: ['invoices', invoiceId, 'status', 'sent'],
    })
  }

  async markAsVoid(invoiceId: string): Promise<VoidInvoiceResponse> {
    return this.http.post<VoidInvoiceResponse>({
      path: ['invoices', invoiceId, 'status', 'void'],
    })
  }

  async markAsDraft(invoiceId: string): Promise<MarkAsDraftResponse> {
    return this.http.post<MarkAsDraftResponse>({
      path: ['invoices', invoiceId, 'status', 'draft'],
    })
  }

  async getEmailContent(
    invoiceId: string,
    params?: GetInvoiceEmailContentQuery
  ): Promise<GetInvoiceEmailContentResponse['data']> {
    const { data } = await this.http.get<GetInvoiceEmailContentResponse>({
      path: ['invoices', invoiceId, 'email'],
      query: { ...params },
    })
    return data
  }

  async email(
    invoiceId: string,
    data: EmailInvoiceRequest,
    params?: EmailInvoiceQuery
  ): Promise<EmailInvoiceResponse> {
    return this.http.post<EmailInvoiceResponse>({
      path: ['invoices', invoiceId, 'email'],
      query: { ...params },
      body: data,
    })
  }

  async bulkEmail(params: EmailInvoicesQuery): Promise<EmailInvoicesResponse> {
    return this.http.post<EmailInvoicesResponse>({
      path: ['invoices', 'email'],
      query: params,
    })
  }

  async getPaymentReminderMailContent(
    invoiceId: string
  ): Promise<GetPaymentReminderMailContentResponse['data']> {
    const { data } = await this.http.get<GetPaymentReminderMailContentResponse>({
      path: ['invoices', invoiceId, 'paymentreminder'],
    })
    return data
  }

  async bulkExport(params: BulkPrintInvoicesQuery): Promise<BulkExportInvoicesResponse> {
    return this.http.get<BulkExportInvoicesResponse>({
      path: ['invoices', 'pdf'],
      query: params,
    })
  }

  async bulkPrint(params: BulkPrintInvoicesQuery): Promise<BulkPrintInvoicesResponse> {
    return this.http.get<BulkPrintInvoicesResponse>({
      path: ['invoices', 'print'],
      query: params,
    })
  }

  async disablePaymentReminder(invoiceId: string): Promise<DisablePaymentReminderResponse> {
    return this.http.post<DisablePaymentReminderResponse>({
      path: ['invoices', invoiceId, 'paymentreminder', 'disable'],
    })
  }

  async enablePaymentReminder(invoiceId: string): Promise<EnablePaymentReminderResponse> {
    return this.http.post<EnablePaymentReminderResponse>({
      path: ['invoices', invoiceId, 'paymentreminder', 'enable'],
    })
  }

  async writeOff(invoiceId: string): Promise<WriteOffInvoiceResponse> {
    return this.http.post<WriteOffInvoiceResponse>({ path: ['invoices', invoiceId, 'writeoff'] })
  }

  async cancelWriteOff(invoiceId: string): Promise<CancelWriteOffResponse> {
    return this.http.post<CancelWriteOffResponse>({
      path: ['invoices', invoiceId, 'writeoff', 'cancel'],
    })
  }

  async updateBillingAddress(
    invoiceId: string,
    data: InvoicesUpdateBillingAddressRequest
  ): Promise<InvoicesUpdateBillingAddressResponse> {
    return this.http.put<InvoicesUpdateBillingAddressResponse>({
      path: ['invoices', invoiceId, 'address', 'billing'],
      body: data,
    })
  }

  async updateShippingAddress(
    invoiceId: string,
    data: InvoicesUpdateShippingAddressRequest
  ): Promise<InvoicesUpdateShippingAddressResponse> {
    return this.http.put<InvoicesUpdateShippingAddressResponse>({
      path: ['invoices', invoiceId, 'address', 'shipping'],
      body: data,
    })
  }

  async listTemplates(): Promise<ListInvoiceTemplatesResponse['templates']> {
    const { templates } = await this.http.get<ListInvoiceTemplatesResponse>({
      path: ['invoices', 'templates'],
    })
    return templates
  }

  async updateTemplate(
    invoiceId: string,
    templateId: string
  ): Promise<UpdateInvoiceTemplateResponse> {
    return this.http.put<UpdateInvoiceTemplateResponse>({
      path: ['invoices', invoiceId, 'templates', templateId],
    })
  }

  async listPayments(invoiceId: string): Promise<ListInvoicePaymentsResponse['payments']> {
    const { payments } = await this.http.get<ListInvoicePaymentsResponse>({
      path: ['invoices', invoiceId, 'payments'],
    })
    return payments
  }

  async listCreditsApplied(invoiceId: string): Promise<ListCreditsAppliedResponse['credits']> {
    const { credits } = await this.http.get<ListCreditsAppliedResponse>({
      path: ['invoices', invoiceId, 'creditsapplied'],
    })
    return credits
  }

  async applyCredits(invoiceId: string, data: ApplyCreditsRequest): Promise<ApplyCreditsResponse> {
    return this.http.post<ApplyCreditsResponse>({
      path: ['invoices', invoiceId, 'credits'],
      body: data,
    })
  }

  async deletePayment(invoiceId: string, invoicePaymentId: string): Promise<void> {
    await this.http.delete({ path: ['invoices', invoiceId, 'payments', invoicePaymentId] })
  }

  async deleteAppliedCredit(invoiceId: string, creditnotesInvoiceId: string): Promise<void> {
    await this.http.delete({
      path: ['invoices', invoiceId, 'creditsapplied', creditnotesInvoiceId],
    })
  }

  async getAttachment(
    invoiceId: string,
    params?: GetInvoiceAttachmentQuery
  ): Promise<GetInvoiceAttachmentResponse> {
    return this.http.get<GetInvoiceAttachmentResponse>({
      path: ['invoices', invoiceId, 'attachment'],
      query: { ...params },
    })
  }

  async updateAttachmentPreference(
    invoiceId: string,
    params: UpdateInvoiceAttachmentQuery
  ): Promise<UpdateAttachmentPreferenceResponse> {
    return this.http.put<UpdateAttachmentPreferenceResponse>({
      path: ['invoices', invoiceId, 'attachment'],
      query: params,
    })
  }

  async addAttachment(
    invoiceId: string,
    params?: AddAttachmentToInvoiceQuery
  ): Promise<AddAttachmentToInvoiceResponse> {
    return this.http.post<AddAttachmentToInvoiceResponse>({
      path: ['invoices', invoiceId, 'attachment'],
      query: { ...params },
    })
  }

  async deleteAttachment(invoiceId: string): Promise<void> {
    await this.http.delete({ path: ['invoices', invoiceId, 'attachment'] })
  }

  async listComments(
    invoiceId: string
  ): Promise<ListInvoiceCommentsAndHistoryResponse['comments']> {
    const { comments } = await this.http.get<ListInvoiceCommentsAndHistoryResponse>({
      path: ['invoices', invoiceId, 'comments'],
    })
    return comments
  }

  async addComment(
    invoiceId: string,
    data: CreateCommentRequest
  ): Promise<InvoicesAddCommentResponse> {
    return this.http.post<InvoicesAddCommentResponse>({
      path: ['invoices', invoiceId, 'comments'],
      body: data,
    })
  }

  async updateComment(
    invoiceId: string,
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<UpdateCommentResponse> {
    return this.http.put<UpdateCommentResponse>({
      path: ['invoices', invoiceId, 'comments', commentId],
      body: data,
    })
  }

  async deleteComment(invoiceId: string, commentId: string): Promise<void> {
    await this.http.delete({ path: ['invoices', invoiceId, 'comments', commentId] })
  }

  async submit(invoiceId: string): Promise<InvoicesApprovalActionResponse> {
    return this.http.post<InvoicesApprovalActionResponse>({
      path: ['invoices', invoiceId, 'submit'],
    })
  }

  async approve(invoiceId: string): Promise<InvoicesApprovalActionResponse> {
    return this.http.post<InvoicesApprovalActionResponse>({
      path: ['invoices', invoiceId, 'approve'],
    })
  }

  async approveFinal(invoiceId: string): Promise<InvoicesApprovalActionResponse> {
    return this.http.post<InvoicesApprovalActionResponse>({
      path: ['invoices', invoiceId, 'approve', 'final'],
    })
  }

  async reject(
    invoiceId: string,
    data: InvoicesRejectRequest
  ): Promise<InvoicesApprovalActionResponse> {
    return this.http.post<InvoicesApprovalActionResponse>({
      path: ['invoices', invoiceId, 'reject'],
      body: data,
    })
  }

  async bulkSubmit(params: BulkSubmitInvoicesQuery): Promise<InvoicesApprovalActionResponse> {
    return this.http.post<InvoicesApprovalActionResponse>({
      path: ['invoices', 'submit'],
      query: params,
    })
  }

  async bulkApprove(params: BulkApproveInvoicesQuery): Promise<InvoicesApprovalActionResponse> {
    return this.http.post<InvoicesApprovalActionResponse>({
      path: ['invoices', 'approve'],
      query: params,
    })
  }
}
