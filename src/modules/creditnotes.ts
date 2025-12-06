import type { ApiClient } from '../client';
import type {
  AddCommentRequest,
  AddCommentResponse,
  ApplyCreditsToInvoicesRequest,
  ApplyCreditsToInvoicesResponse,
  ApproveCreditNoteResponse,
  ConvertCreditNoteToDraftResponse,
  ConvertCreditNoteToOpenResponse,
  CreateCreditNoteRequest,
  CreateCreditNoteResponse,
  DeleteCommentResponse,
  DeleteCreditNoteRefundResponse,
  DeleteCreditNoteResponse,
  DeleteCreditsAppliedToInvoiceResponse,
  EmailCreditNoteRequest,
  EmailCreditNoteResponse,
  EmailHistoryResponse,
  GetCreditNoteRefundResponse,
  GetCreditNoteResponse,
  GetEmailContentResponse,
  ListAllCreditNotesResponse,
  ListCreditNoteCommentsAndHistoryResponse,
  ListCreditNoteRefundsResponse,
  ListInvoicesCreditedResponse,
  ListTheCreditNoteTemplatesResponse,
  RefundCreditNoteRequest,
  RefundCreditNoteResponse,
  SubmitCreditNoteForApprovalResponse,
  UpdateBillingAddressRequest,
  UpdateBillingAddressResponse,
  UpdateCreditNoteRefundRequest,
  UpdateCreditNoteRefundResponse,
  UpdateCreditNoteRequest,
  UpdateCreditNoteResponse,
  UpdateCreditNoteTemplateResponse,
  UpdateShippingAddressRequest,
  UpdateShippingAddressResponse,
  VoidCreditNoteResponse,
} from '../types/creditnote';

export class CreditNoteModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * List all Credit Notes
   */
  async list(opts?: {
    filterBy?: string;
    sortColumn?: string;
    searchText?: string;
    page?: number;
    limit?: number;
  }): Promise<ListAllCreditNotesResponse['creditnotes']> {
    return this.client.getList({
      path: ['creditnotes'],
      limit: opts?.limit,
      params: {
        filter_by: opts?.filterBy ?? '',
        sort_column: opts?.sortColumn ?? '',
        search_text: opts?.searchText ?? '',
      },
      extractor: (res: ListAllCreditNotesResponse) => res.creditnotes ?? [],
    });
  }

  /**
   * Create a credit note
   */
  async create(
    creditNote: CreateCreditNoteRequest,
    params?: { invoice_id?: string; ignore_auto_number_generation?: boolean }
  ): Promise<CreateCreditNoteResponse['creditnote']> {
    const res = await this.client.post<CreateCreditNoteResponse>({
      path: ['creditnotes'],
      params,
      body: creditNote,
    });

    return res.creditnote;
  }

  /**
   * Get a credit note
   */
  async get(
    creditNoteId: string,
    params?: { print?: boolean; accept?: 'json' | 'pdf' | 'html' }
  ): Promise<GetCreditNoteResponse['creditnote']> {
    const res = await this.client.get<GetCreditNoteResponse>({
      path: ['creditnotes', creditNoteId],
      params,
    });

    return res.creditnote;
  }

  /**
   * Update a credit note
   */
  async update(
    creditNoteId: string,
    creditNote: UpdateCreditNoteRequest,
    params?: { ignore_auto_number_generation?: boolean }
  ): Promise<UpdateCreditNoteResponse['creditnote']> {
    const res = await this.client.put<UpdateCreditNoteResponse>({
      path: ['creditnotes', creditNoteId],
      params,
      body: creditNote,
    });

    return res.creditnote;
  }

  /**
   * Delete a credit note
   */
  async delete(creditNoteId: string): Promise<DeleteCreditNoteResponse> {
    const res = await this.client.delete<DeleteCreditNoteResponse>({
      path: ['creditnotes', creditNoteId],
    });

    return res;
  }

  /**
   * Email a credit note
   */
  async email(
    creditNoteId: string,
    data: EmailCreditNoteRequest,
    params?: { customer_id?: string; attachments?: string }
  ): Promise<EmailCreditNoteResponse> {
    const res = await this.client.post<EmailCreditNoteResponse>({
      path: ['creditnotes', creditNoteId, 'email'],
      params,
      body: data,
    });

    return res;
  }

  /**
   * Get email content of a credit note
   */
  async getEmailContent(
    creditNoteId: string,
    params?: { email_template_id?: string }
  ): Promise<GetEmailContentResponse['data']> {
    const res = await this.client.get<GetEmailContentResponse>({
      path: ['creditnotes', creditNoteId, 'email'],
      params,
    });

    return res.data;
  }

  /**
   * Mark the credit note as Void
   */
  async markAsVoid(creditNoteId: string): Promise<VoidCreditNoteResponse> {
    const res = await this.client.post<VoidCreditNoteResponse>({
      path: ['creditnotes', creditNoteId, 'void'],
    });

    return res;
  }

  /**
   * Convert a voided credit note to Draft
   */
  async markAsDraft(
    creditNoteId: string
  ): Promise<ConvertCreditNoteToDraftResponse> {
    const res = await this.client.post<ConvertCreditNoteToDraftResponse>({
      path: ['creditnotes', creditNoteId, 'draft'],
    });

    return res;
  }

  /**
   * Convert a credit note in Draft status to Open
   */
  async markAsOpen(
    creditNoteId: string
  ): Promise<ConvertCreditNoteToOpenResponse> {
    const res = await this.client.post<ConvertCreditNoteToOpenResponse>({
      path: ['creditnotes', creditNoteId, 'converttoopen'],
    });

    return res;
  }

  /**
   * Submit a credit note for approval
   */
  async submit(
    creditNoteId: string
  ): Promise<SubmitCreditNoteForApprovalResponse> {
    const res = await this.client.post<SubmitCreditNoteForApprovalResponse>({
      path: ['creditnotes', creditNoteId, 'submit'],
    });

    return res;
  }

  /**
   * Approve a credit note
   */
  async approve(creditNoteId: string): Promise<ApproveCreditNoteResponse> {
    const res = await this.client.post<ApproveCreditNoteResponse>({
      path: ['creditnotes', creditNoteId, 'approve'],
    });

    return res;
  }

  /**
   * Get email history of a credit note
   */
  async getEmailHistory(
    creditNoteId: string
  ): Promise<EmailHistoryResponse['email_history']> {
    const res = await this.client.get<EmailHistoryResponse>({
      path: ['creditnotes', creditNoteId, 'emailhistory'],
    });

    return res.email_history;
  }

  /**
   * Update billing address
   */
  async updateBillingAddress(
    creditNoteId: string,
    address: UpdateBillingAddressRequest
  ): Promise<UpdateBillingAddressResponse> {
    const res = await this.client.put<UpdateBillingAddressResponse>({
      path: ['creditnotes', creditNoteId, 'address', 'billing'],
      body: address,
    });

    return res;
  }

  async updateShippingAddress(
    creditnoteId: string,
    data: UpdateShippingAddressRequest
  ): Promise<UpdateShippingAddressResponse> {
    return this.client.put({
      path: ['creditnotes', creditnoteId, 'address', 'shipping'],
      body: data,
    });
  }

  async listTemplates(): Promise<
    ListTheCreditNoteTemplatesResponse['templates']
  > {
    return this.client.getList({
      path: ['creditnotes', 'templates'],
      extractor: (res: ListTheCreditNoteTemplatesResponse) =>
        res.templates ?? [],
    });
  }

  async updateTemplate(
    creditnoteId: string,
    templateId: string
  ): Promise<UpdateCreditNoteTemplateResponse> {
    return this.client.put({
      path: ['creditnotes', creditnoteId, 'templates', templateId],
    });
  }

  async listInvoicesCredited(
    creditnoteId: string
  ): Promise<ListInvoicesCreditedResponse['invoices_credited']> {
    const res = await this.client.get<ListInvoicesCreditedResponse>({
      path: ['creditnotes', creditnoteId, 'invoices'],
    });
    return res.invoices_credited ?? [];
  }

  async applyToInvoices(
    creditnoteId: string,
    data: ApplyCreditsToInvoicesRequest
  ): Promise<ApplyCreditsToInvoicesResponse> {
    return this.client.post({
      path: ['creditnotes', creditnoteId, 'invoices'],
      body: data,
    });
  }

  async deleteCreditsFromInvoice(
    creditnoteId: string,
    creditnoteInvoiceId: string
  ): Promise<DeleteCreditsAppliedToInvoiceResponse> {
    return this.client.delete({
      path: ['creditnotes', creditnoteId, 'invoices', creditnoteInvoiceId],
    });
  }

  async listComments(
    creditnoteId: string
  ): Promise<ListCreditNoteCommentsAndHistoryResponse['comments']> {
    const res = await this.client.get<ListCreditNoteCommentsAndHistoryResponse>(
      {
        path: ['creditnotes', creditnoteId, 'comments'],
      }
    );
    return res.comments ?? [];
  }

  async addComment(
    creditnoteId: string,
    comment: AddCommentRequest
  ): Promise<AddCommentResponse> {
    return await this.client.post<AddCommentResponse>({
      path: ['creditnotes', creditnoteId, 'comments'],
      body: comment,
    });
  }

  async deleteComment(
    creditnoteId: string,
    commentId: string
  ): Promise<DeleteCommentResponse> {
    return this.client.delete({
      path: ['creditnotes', creditnoteId, 'comments', commentId],
    });
  }

  async listAllRefunds(
    params?: Record<string, string | number>
  ): Promise<ListCreditNoteRefundsResponse['creditnote_refunds']> {
    return this.client.getList({
      path: ['creditnotes', 'refunds'],
      params,
      extractor: (res: ListCreditNoteRefundsResponse) =>
        res.creditnote_refunds ?? [],
    });
  }

  async listRefunds(
    creditnoteId: string,
    params?: Record<string, string | number>
  ): Promise<ListCreditNoteRefundsResponse['creditnote_refunds']> {
    return this.client.getList({
      path: ['creditnotes', creditnoteId, 'refunds'],
      params,
      extractor: (res: ListCreditNoteRefundsResponse) =>
        res.creditnote_refunds ?? [],
    });
  }

  async createRefund(
    creditnoteId: string,
    data: RefundCreditNoteRequest
  ): Promise<RefundCreditNoteResponse['creditnote_refund']> {
    const res = await this.client.post<RefundCreditNoteResponse>({
      path: ['creditnotes', creditnoteId, 'refunds'],
      body: data,
    });
    return res.creditnote_refund;
  }

  async getRefund(
    creditnoteId: string,
    refundId: string
  ): Promise<GetCreditNoteRefundResponse['creditnote_refund']> {
    const res = await this.client.get<GetCreditNoteRefundResponse>({
      path: ['creditnotes', creditnoteId, 'refunds', refundId],
    });
    return res.creditnote_refund;
  }

  async updateRefund(
    creditnoteId: string,
    refundId: string,
    data: UpdateCreditNoteRefundRequest
  ): Promise<UpdateCreditNoteRefundResponse['creditnote_refund']> {
    const res = await this.client.put<UpdateCreditNoteRefundResponse>({
      path: ['creditnotes', creditnoteId, 'refunds', refundId],
      body: data,
    });
    return res.creditnote_refund;
  }

  async deleteRefund(
    creditnoteId: string,
    refundId: string
  ): Promise<DeleteCreditNoteRefundResponse> {
    return this.client.delete({
      path: ['creditnotes', creditnoteId, 'refunds', refundId],
    });
  }
}
