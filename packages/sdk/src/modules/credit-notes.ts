import type {
  AddAttachmentToCreditNoteQuery,
  AddAttachmentToCreditNoteResponse,
  AddCommentRequest,
  AddCommentResponse,
  ApplyCreditsToInvoicesRequest,
  ApplyCreditsToInvoicesResponse,
  ApproveCreditNoteResponse,
  ConvertCreditNoteToDraftResponse,
  ConvertCreditNoteToOpenResponse,
  CreateCreditNoteQuery,
  CreateCreditNoteRequest,
  CreateCreditNoteResponse,
  DeleteCommentResponse,
  DeleteCreditNoteAttachmentResponse,
  DeleteCreditNoteRefundResponse,
  DeleteCreditNoteResponse,
  DeleteCreditsAppliedToInvoiceResponse,
  EmailCreditNoteQuery,
  EmailCreditNoteRequest,
  EmailCreditNoteResponse,
  EmailHistoryResponse,
  GetCreditNoteEmailContentQuery,
  GetCreditNoteQuery,
  GetCreditNoteRefundResponse,
  GetCreditNoteResponse,
  GetEmailContentResponse,
  ListCreditNoteCommentsAndHistoryResponse,
  ListCreditNoteRefundsOfCreditNotesQuery,
  ListCreditNoteRefundsOfCreditNotesQuery_1,
  ListCreditNoteRefundsResponse,
  ListCreditNoteTemplatesResponse,
  ListCreditNotesQuery,
  ListCreditNotesResponse,
  ListInvoicesCreditedResponse,
  ListRefundsOfCreditNoteResponse,
  MarkCreditNoteAsDraftQuery,
  RefundCreditNoteRequest,
  RefundCreditNoteResponse,
  RejectCreditNoteQuery,
  RejectCreditNoteResponse,
  SubmitCreditNoteForApprovalResponse,
  UpdateBillingAddressRequest,
  UpdateBillingAddressResponse,
  UpdateCreditNoteQuery,
  UpdateCreditNoteRefundRequest,
  UpdateCreditNoteRefundResponse,
  UpdateCreditNoteRequest,
  UpdateCreditNoteResponse,
  UpdateCreditNoteTemplateResponse,
  UpdateShippingAddressRequest,
  UpdateShippingAddressResponse,
  VoidCreditNoteResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'
import type { PartialBy } from '../utils.ts'

export class CreditNotes {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListCreditNotesQuery): Promise<ListCreditNotesResponse['creditnotes']> {
    const { creditnotes } = await this.http.get<ListCreditNotesResponse>({
      path: ['creditnotes'],
      query: params,
    })
    return creditnotes
  }

  // creditnote_number is only mandatory when params.ignore_auto_number_generation is true;
  // otherwise Zoho auto-generates it. Zoho's spec always marks it required, so it's relaxed here.
  async create(
    data: PartialBy<CreateCreditNoteRequest, 'creditnote_number'>,
    params?: CreateCreditNoteQuery
  ): Promise<CreateCreditNoteResponse['creditnote']> {
    const { creditnote } = await this.http.post<CreateCreditNoteResponse>({
      path: ['creditnotes'],
      query: params,
      body: data,
    })
    return creditnote
  }

  async get(
    creditnoteId: string,
    params?: GetCreditNoteQuery
  ): Promise<GetCreditNoteResponse['creditnote']> {
    const { creditnote } = await this.http.get<GetCreditNoteResponse>({
      path: ['creditnotes', creditnoteId],
      query: params,
    })
    return creditnote
  }

  async update(
    creditnoteId: string,
    data: PartialBy<UpdateCreditNoteRequest, 'creditnote_number'>,
    params?: UpdateCreditNoteQuery
  ): Promise<UpdateCreditNoteResponse['creditnote']> {
    const { creditnote } = await this.http.put<UpdateCreditNoteResponse>({
      path: ['creditnotes', creditnoteId],
      query: params,
      body: data,
    })
    return creditnote
  }

  async delete(creditnoteId: string): Promise<DeleteCreditNoteResponse> {
    return this.http.delete<DeleteCreditNoteResponse>({ path: ['creditnotes', creditnoteId] })
  }

  async getEmailContent(
    creditnoteId: string,
    params?: GetCreditNoteEmailContentQuery
  ): Promise<GetEmailContentResponse['data']> {
    const { data } = await this.http.get<GetEmailContentResponse>({
      path: ['creditnotes', creditnoteId, 'email'],
      query: { ...params },
    })
    return data
  }

  async email(
    creditnoteId: string,
    data: EmailCreditNoteRequest,
    params?: EmailCreditNoteQuery
  ): Promise<EmailCreditNoteResponse> {
    return this.http.post<EmailCreditNoteResponse>({
      path: ['creditnotes', creditnoteId, 'email'],
      query: { ...params },
      body: data,
    })
  }

  async markAsVoid(creditnoteId: string): Promise<VoidCreditNoteResponse> {
    return this.http.post<VoidCreditNoteResponse>({ path: ['creditnotes', creditnoteId, 'void'] })
  }

  async markAsDraft(
    creditnoteId: string,
    params?: MarkCreditNoteAsDraftQuery
  ): Promise<ConvertCreditNoteToDraftResponse> {
    return this.http.post<ConvertCreditNoteToDraftResponse>({
      path: ['creditnotes', creditnoteId, 'status', 'draft'],
      query: { ...params },
    })
  }

  async markAsOpen(creditnoteId: string): Promise<ConvertCreditNoteToOpenResponse> {
    return this.http.post<ConvertCreditNoteToOpenResponse>({
      path: ['creditnotes', creditnoteId, 'converttoopen'],
    })
  }

  async submit(creditnoteId: string): Promise<SubmitCreditNoteForApprovalResponse> {
    return this.http.post<SubmitCreditNoteForApprovalResponse>({
      path: ['creditnotes', creditnoteId, 'submit'],
    })
  }

  async approve(creditnoteId: string): Promise<ApproveCreditNoteResponse> {
    return this.http.post<ApproveCreditNoteResponse>({
      path: ['creditnotes', creditnoteId, 'approve'],
    })
  }

  async reject(
    creditnoteId: string,
    params?: RejectCreditNoteQuery
  ): Promise<RejectCreditNoteResponse> {
    return this.http.post<RejectCreditNoteResponse>({
      path: ['creditnotes', creditnoteId, 'reject'],
      query: { ...params },
    })
  }

  async getEmailHistory(creditnoteId: string): Promise<EmailHistoryResponse['email_history']> {
    const { email_history } = await this.http.get<EmailHistoryResponse>({
      path: ['creditnotes', creditnoteId, 'emailhistory'],
    })
    return email_history
  }

  async addAttachment(
    creditnoteId: string,
    params?: AddAttachmentToCreditNoteQuery
  ): Promise<AddAttachmentToCreditNoteResponse> {
    return this.http.post<AddAttachmentToCreditNoteResponse>({
      path: ['creditnotes', creditnoteId, 'attachment'],
      query: { ...params },
    })
  }

  async deleteAttachment(
    creditnoteId: string,
    documentId: string
  ): Promise<DeleteCreditNoteAttachmentResponse> {
    return this.http.delete<DeleteCreditNoteAttachmentResponse>({
      path: ['creditnotes', creditnoteId, 'documents', documentId],
    })
  }

  async updateBillingAddress(
    creditnoteId: string,
    data: UpdateBillingAddressRequest
  ): Promise<UpdateBillingAddressResponse> {
    return this.http.put<UpdateBillingAddressResponse>({
      path: ['creditnotes', creditnoteId, 'address', 'billing'],
      body: data,
    })
  }

  async updateShippingAddress(
    creditnoteId: string,
    data: UpdateShippingAddressRequest
  ): Promise<UpdateShippingAddressResponse> {
    return this.http.put<UpdateShippingAddressResponse>({
      path: ['creditnotes', creditnoteId, 'address', 'shipping'],
      body: data,
    })
  }

  async listTemplates(): Promise<ListCreditNoteTemplatesResponse['templates']> {
    const { templates } = await this.http.get<ListCreditNoteTemplatesResponse>({
      path: ['creditnotes', 'templates'],
    })
    return templates
  }

  async updateTemplate(
    creditnoteId: string,
    templateId: string
  ): Promise<UpdateCreditNoteTemplateResponse> {
    return this.http.put<UpdateCreditNoteTemplateResponse>({
      path: ['creditnotes', creditnoteId, 'templates', templateId],
    })
  }

  async listInvoicesCredited(
    creditnoteId: string
  ): Promise<ListInvoicesCreditedResponse['invoices_credited']> {
    const { invoices_credited } = await this.http.get<ListInvoicesCreditedResponse>({
      path: ['creditnotes', creditnoteId, 'invoices'],
    })
    return invoices_credited
  }

  async applyCreditsToInvoices(
    creditnoteId: string,
    data: ApplyCreditsToInvoicesRequest
  ): Promise<ApplyCreditsToInvoicesResponse> {
    return this.http.post<ApplyCreditsToInvoicesResponse>({
      path: ['creditnotes', creditnoteId, 'invoices'],
      body: data,
    })
  }

  async deleteCreditsAppliedToInvoice(
    creditnoteId: string,
    creditnoteInvoiceId: string
  ): Promise<DeleteCreditsAppliedToInvoiceResponse> {
    return this.http.delete<DeleteCreditsAppliedToInvoiceResponse>({
      path: ['creditnotes', creditnoteId, 'invoices', creditnoteInvoiceId],
    })
  }

  async listComments(
    creditnoteId: string
  ): Promise<ListCreditNoteCommentsAndHistoryResponse['comments']> {
    const { comments } = await this.http.get<ListCreditNoteCommentsAndHistoryResponse>({
      path: ['creditnotes', creditnoteId, 'comments'],
    })
    return comments
  }

  async addComment(creditnoteId: string, data: AddCommentRequest): Promise<AddCommentResponse> {
    return this.http.post<AddCommentResponse>({
      path: ['creditnotes', creditnoteId, 'comments'],
      body: data,
    })
  }

  async deleteComment(creditnoteId: string, commentId: string): Promise<DeleteCommentResponse> {
    return this.http.delete<DeleteCommentResponse>({
      path: ['creditnotes', creditnoteId, 'comments', commentId],
    })
  }

  async listRefunds(
    params?: ListCreditNoteRefundsOfCreditNotesQuery
  ): Promise<ListCreditNoteRefundsResponse['creditnote_refunds']> {
    const { creditnote_refunds } = await this.http.get<ListCreditNoteRefundsResponse>({
      path: ['creditnotes', 'refunds'],
      query: { ...params },
    })
    return creditnote_refunds
  }

  async listRefundsForCreditNote(
    creditnoteId: string,
    params?: ListCreditNoteRefundsOfCreditNotesQuery_1
  ): Promise<ListRefundsOfCreditNoteResponse['creditnote_refunds']> {
    const { creditnote_refunds } = await this.http.get<ListRefundsOfCreditNoteResponse>({
      path: ['creditnotes', creditnoteId, 'refunds'],
      query: { ...params },
    })
    return creditnote_refunds
  }

  async createRefund(
    creditnoteId: string,
    data: RefundCreditNoteRequest
  ): Promise<RefundCreditNoteResponse['creditnote_refund']> {
    const { creditnote_refund } = await this.http.post<RefundCreditNoteResponse>({
      path: ['creditnotes', creditnoteId, 'refunds'],
      body: data,
    })
    return creditnote_refund
  }

  async getRefund(
    creditnoteId: string,
    creditnoteRefundId: string
  ): Promise<GetCreditNoteRefundResponse['creditnote_refund']> {
    const { creditnote_refund } = await this.http.get<GetCreditNoteRefundResponse>({
      path: ['creditnotes', creditnoteId, 'refunds', creditnoteRefundId],
    })
    return creditnote_refund
  }

  async updateRefund(
    creditnoteId: string,
    creditnoteRefundId: string,
    data: UpdateCreditNoteRefundRequest
  ): Promise<UpdateCreditNoteRefundResponse['creditnote_refund']> {
    const { creditnote_refund } = await this.http.put<UpdateCreditNoteRefundResponse>({
      path: ['creditnotes', creditnoteId, 'refunds', creditnoteRefundId],
      body: data,
    })
    return creditnote_refund
  }

  async deleteRefund(
    creditnoteId: string,
    creditnoteRefundId: string
  ): Promise<DeleteCreditNoteRefundResponse> {
    return this.http.delete<DeleteCreditNoteRefundResponse>({
      path: ['creditnotes', creditnoteId, 'refunds', creditnoteRefundId],
    })
  }
}
