import type { ApiClient } from '../client';
import type {
  AddCommentRequest,
  ApplyCreditsToInvoicesRequest,
  CreateCreditNoteRequest,
  CreateCreditNoteResponse,
  EmailCreditNoteRequest,
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
  UpdateBillingAddressRequest,
  UpdateCreditNoteRefundRequest,
  UpdateCreditNoteRefundResponse,
  UpdateCreditNoteRequest,
  UpdateCreditNoteResponse,
  UpdateShippingAddressRequest,
} from '../types/creditnote';

export class CreditNoteModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * List all Credit Notes
   */
  list(opts?: {
    filter_by?: string;
    sort_column?: string;
    search_text?: string;
    limit?: number;
  }): Promise<ListAllCreditNotesResponse['creditnotes']> {
    const { limit, ...params } = opts ?? {};
    return this.client.getList({
      path: ['creditnotes'],
      limit: limit,
      params,
      extractor: (res: ListAllCreditNotesResponse) => res.creditnotes ?? [],
    });
  }

  /**
   * Create a credit note
   */
  async create(
    creditNote: CreateCreditNoteRequest,
    opts?: { invoice_id?: string; ignore_auto_number_generation?: boolean }
  ): Promise<CreateCreditNoteResponse['creditnote']> {
    const res = await this.client.post<CreateCreditNoteResponse>({
      path: ['creditnotes'],
      params: opts,
      body: creditNote,
    });

    return res.creditnote;
  }

  /**
   * Get a credit note
   */
  async get(
    creditNoteId: string,
    opts?: { print?: boolean; accept?: 'json' | 'pdf' | 'html' }
  ): Promise<GetCreditNoteResponse['creditnote']> {
    const res = await this.client.get<GetCreditNoteResponse>({
      path: ['creditnotes', creditNoteId],
      params: opts,
    });

    return res.creditnote;
  }

  /**
   * Update a credit note
   */
  async update(
    creditNoteId: string,
    creditNote: UpdateCreditNoteRequest,
    opts?: { ignore_auto_number_generation?: boolean }
  ): Promise<UpdateCreditNoteResponse['creditnote']> {
    const res = await this.client.put<UpdateCreditNoteResponse>({
      path: ['creditnotes', creditNoteId],
      params: opts,
      body: creditNote,
    });

    return res.creditnote;
  }

  /**
   * Delete a credit note
   */
  delete(creditNoteId: string): Promise<void> {
    return this.client.delete({
      path: ['creditnotes', creditNoteId],
    });
  }

  /**
   * Email a credit note
   */
  email(
    creditNoteId: string,
    emailCreditNote: EmailCreditNoteRequest,
    opts?: { customer_id?: string; attachments?: string }
  ): Promise<void> {
    return this.client.post({
      path: ['creditnotes', creditNoteId, 'email'],
      params: opts,
      body: emailCreditNote,
    });
  }

  /**
   * Get email content of a credit note
   */
  async getEmailContent(
    creditNoteId: string,
    opts?: { email_template_id?: string }
  ): Promise<GetEmailContentResponse['data']> {
    const res = await this.client.get<GetEmailContentResponse>({
      path: ['creditnotes', creditNoteId, 'email'],
      params: opts,
    });

    return res.data;
  }

  /**
   * Mark the credit note as Void
   */
  async markAsVoid(creditNoteId: string): Promise<void> {
    return this.client.post({
      path: ['creditnotes', creditNoteId, 'void'],
    });
  }

  /**
   * Convert a voided credit note to Draft
   */
  async markAsDraft(creditNoteId: string): Promise<void> {
    return this.client.post({
      path: ['creditnotes', creditNoteId, 'draft'],
    });
  }

  /**
   * Convert a credit note in Draft status to Open
   */
  async markAsOpen(creditNoteId: string): Promise<void> {
    return this.client.post({
      path: ['creditnotes', creditNoteId, 'converttoopen'],
    });
  }

  /**
   * Submit a credit note for approval
   */
  async submit(creditNoteId: string): Promise<void> {
    return this.client.post({
      path: ['creditnotes', creditNoteId, 'submit'],
    });
  }

  /**
   * Approve a credit note
   */
  approve(creditNoteId: string): Promise<void> {
    return this.client.post({
      path: ['creditnotes', creditNoteId, 'approve'],
    });
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
  updateBillingAddress(
    creditNoteId: string,
    address: UpdateBillingAddressRequest
  ): Promise<void> {
    return this.client.put({
      path: ['creditnotes', creditNoteId, 'address', 'billing'],
      body: address,
    });
  }

  updateShippingAddress(
    creditnoteId: string,
    shippingAddress: UpdateShippingAddressRequest
  ): Promise<void> {
    return this.client.put({
      path: ['creditnotes', creditnoteId, 'address', 'shipping'],
      body: shippingAddress,
    });
  }

  listTemplates(): Promise<ListTheCreditNoteTemplatesResponse['templates']> {
    return this.client.getList({
      path: ['creditnotes', 'templates'],
      extractor: (res: ListTheCreditNoteTemplatesResponse) =>
        res.templates ?? [],
    });
  }

  updateTemplate(creditnoteId: string, templateId: string): Promise<void> {
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

  applyToInvoices(
    creditnoteId: string,
    data: ApplyCreditsToInvoicesRequest
  ): Promise<void> {
    return this.client.post({
      path: ['creditnotes', creditnoteId, 'invoices'],
      body: data,
    });
  }

  deleteCreditsFromInvoice(
    creditnoteId: string,
    creditnoteInvoiceId: string
  ): Promise<void> {
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
    return res.comments;
  }

  addComment(creditnoteId: string, comment: AddCommentRequest): Promise<void> {
    return this.client.post({
      path: ['creditnotes', creditnoteId, 'comments'],
      body: comment,
    });
  }

  deleteComment(creditnoteId: string, commentId: string): Promise<void> {
    return this.client.delete({
      path: ['creditnotes', creditnoteId, 'comments', commentId],
    });
  }

  listAllRefunds(
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

  deleteRefund(creditnoteId: string, refundId: string): Promise<void> {
    return this.client.delete({
      path: ['creditnotes', creditnoteId, 'refunds', refundId],
    });
  }
}
