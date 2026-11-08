import type {
  AddCommentRequest,
  ApplyCreditsToInvoicesRequest,
  CreateCreditNoteQuery,
  CreateCreditNoteRequest,
  CreateCreditNoteResponse,
  EmailCreditNoteQuery,
  EmailCreditNoteRequest,
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
  UpdateBillingAddressRequest,
  UpdateCreditNoteQuery,
  UpdateCreditNoteRefundRequest,
  UpdateCreditNoteRefundResponse,
  UpdateCreditNoteRequest,
  UpdateCreditNoteResponse,
  UpdateShippingAddressRequest,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'
import type { PartialBy } from '../utils.ts'

/**
 * Credit notes are created when a refund is to be made to a customer. A credit note object allows you to keep track of all credit note related information. <code>Note</code> While creating credit notes from Sales Order Invoice or Sales Return, it is recommended to use the same values which are used in the Invoice for corresponding nodes in the credit note.
 */
export function createCreditNotes(http: HTTPClient) {
  return {
    async list(params?: ListCreditNotesQuery): Promise<ListCreditNotesResponse['creditnotes']> {
      const { creditnotes } = await http.get<ListCreditNotesResponse>({
        path: ['creditnotes'],
        query: params,
      })
      return creditnotes
    },

    // creditnote_number is only mandatory when params.ignore_auto_number_generation is true.
    // Otherwise Zoho auto-generates it. Zoho's spec always marks it required, so it's relaxed here.
    async create(
      data: PartialBy<CreateCreditNoteRequest, 'creditnote_number'>,
      params?: CreateCreditNoteQuery
    ): Promise<CreateCreditNoteResponse['creditnote']> {
      const { creditnote } = await http.post<CreateCreditNoteResponse>({
        path: ['creditnotes'],
        query: params,
        body: data,
      })
      return creditnote
    },

    async get(
      creditnoteId: string,
      params?: GetCreditNoteQuery
    ): Promise<GetCreditNoteResponse['creditnote']> {
      const { creditnote } = await http.get<GetCreditNoteResponse>({
        path: ['creditnotes', creditnoteId],
        query: params,
      })
      return creditnote
    },

    async update(
      creditnoteId: string,
      data: PartialBy<UpdateCreditNoteRequest, 'creditnote_number'>,
      params?: UpdateCreditNoteQuery
    ): Promise<UpdateCreditNoteResponse['creditnote']> {
      const { creditnote } = await http.put<UpdateCreditNoteResponse>({
        path: ['creditnotes', creditnoteId],
        query: params,
        body: data,
      })
      return creditnote
    },

    async delete(creditnoteId: string): Promise<void> {
      await http.delete({ path: ['creditnotes', creditnoteId] })
    },

    async getEmailContent(
      creditnoteId: string,
      params?: GetCreditNoteEmailContentQuery
    ): Promise<GetEmailContentResponse['data']> {
      const { data } = await http.get<GetEmailContentResponse>({
        path: ['creditnotes', creditnoteId, 'email'],
        query: { ...params },
      })
      return data
    },

    async email(
      creditnoteId: string,
      data: EmailCreditNoteRequest,
      params?: EmailCreditNoteQuery
    ): Promise<void> {
      await http.post({
        path: ['creditnotes', creditnoteId, 'email'],
        query: { ...params },
        body: data,
      })
    },

    async markAsVoid(creditnoteId: string): Promise<void> {
      await http.post({ path: ['creditnotes', creditnoteId, 'void'] })
    },

    async markAsDraft(creditnoteId: string, params?: MarkCreditNoteAsDraftQuery): Promise<void> {
      await http.post({
        path: ['creditnotes', creditnoteId, 'status', 'draft'],
        query: { ...params },
      })
    },

    async markAsOpen(creditnoteId: string): Promise<void> {
      await http.post({
        path: ['creditnotes', creditnoteId, 'converttoopen'],
      })
    },

    async submit(creditnoteId: string): Promise<void> {
      await http.post({
        path: ['creditnotes', creditnoteId, 'submit'],
      })
    },

    async approve(creditnoteId: string): Promise<void> {
      await http.post({
        path: ['creditnotes', creditnoteId, 'approve'],
      })
    },

    async reject(creditnoteId: string, params?: RejectCreditNoteQuery): Promise<void> {
      await http.post({
        path: ['creditnotes', creditnoteId, 'reject'],
        query: { ...params },
      })
    },

    async getEmailHistory(creditnoteId: string): Promise<EmailHistoryResponse['email_history']> {
      const { email_history } = await http.get<EmailHistoryResponse>({
        path: ['creditnotes', creditnoteId, 'emailhistory'],
      })
      return email_history
    },

    async addAttachment(
      creditnoteId: string,
      attachment: Blob,
      documentIds?: string
    ): Promise<void> {
      const body = new FormData()
      body.append('attachment', attachment)
      if (documentIds !== undefined) body.append('document_ids', documentIds)
      await http.post({
        path: ['creditnotes', creditnoteId, 'attachment'],
        body,
      })
    },

    async deleteAttachment(creditnoteId: string, documentId: string): Promise<void> {
      await http.delete({
        path: ['creditnotes', creditnoteId, 'documents', documentId],
      })
    },

    async updateBillingAddress(
      creditnoteId: string,
      data: UpdateBillingAddressRequest
    ): Promise<void> {
      await http.put({
        path: ['creditnotes', creditnoteId, 'address', 'billing'],
        body: data,
      })
    },

    async updateShippingAddress(
      creditnoteId: string,
      data: UpdateShippingAddressRequest
    ): Promise<void> {
      await http.put({
        path: ['creditnotes', creditnoteId, 'address', 'shipping'],
        body: data,
      })
    },

    async listTemplates(): Promise<ListCreditNoteTemplatesResponse['templates']> {
      const { templates } = await http.get<ListCreditNoteTemplatesResponse>({
        path: ['creditnotes', 'templates'],
      })
      return templates
    },

    async updateTemplate(creditnoteId: string, templateId: string): Promise<void> {
      await http.put({
        path: ['creditnotes', creditnoteId, 'templates', templateId],
      })
    },

    async listInvoicesCredited(
      creditnoteId: string
    ): Promise<ListInvoicesCreditedResponse['invoices_credited']> {
      const { invoices_credited } = await http.get<ListInvoicesCreditedResponse>({
        path: ['creditnotes', creditnoteId, 'invoices'],
      })
      return invoices_credited
    },

    async applyCreditsToInvoices(
      creditnoteId: string,
      data: ApplyCreditsToInvoicesRequest
    ): Promise<void> {
      await http.post({
        path: ['creditnotes', creditnoteId, 'invoices'],
        body: data,
      })
    },

    async deleteCreditsAppliedToInvoice(
      creditnoteId: string,
      creditnoteInvoiceId: string
    ): Promise<void> {
      await http.delete({
        path: ['creditnotes', creditnoteId, 'invoices', creditnoteInvoiceId],
      })
    },

    async listComments(
      creditnoteId: string
    ): Promise<ListCreditNoteCommentsAndHistoryResponse['comments']> {
      const { comments } = await http.get<ListCreditNoteCommentsAndHistoryResponse>({
        path: ['creditnotes', creditnoteId, 'comments'],
      })
      return comments
    },

    async addComment(creditnoteId: string, data: AddCommentRequest): Promise<void> {
      await http.post({
        path: ['creditnotes', creditnoteId, 'comments'],
        body: data,
      })
    },

    async deleteComment(creditnoteId: string, commentId: string): Promise<void> {
      await http.delete({
        path: ['creditnotes', creditnoteId, 'comments', commentId],
      })
    },

    async listRefunds(
      params?: ListCreditNoteRefundsOfCreditNotesQuery
    ): Promise<ListCreditNoteRefundsResponse['creditnote_refunds']> {
      const { creditnote_refunds } = await http.get<ListCreditNoteRefundsResponse>({
        path: ['creditnotes', 'refunds'],
        query: { ...params },
      })
      return creditnote_refunds
    },

    async listRefundsForCreditNote(
      creditnoteId: string,
      params?: ListCreditNoteRefundsOfCreditNotesQuery_1
    ): Promise<ListRefundsOfCreditNoteResponse['creditnote_refunds']> {
      const { creditnote_refunds } = await http.get<ListRefundsOfCreditNoteResponse>({
        path: ['creditnotes', creditnoteId, 'refunds'],
        query: { ...params },
      })
      return creditnote_refunds
    },

    async createRefund(
      creditnoteId: string,
      data: RefundCreditNoteRequest
    ): Promise<RefundCreditNoteResponse['creditnote_refund']> {
      const { creditnote_refund } = await http.post<RefundCreditNoteResponse>({
        path: ['creditnotes', creditnoteId, 'refunds'],
        body: data,
      })
      return creditnote_refund
    },

    async getRefund(
      creditnoteId: string,
      creditnoteRefundId: string
    ): Promise<GetCreditNoteRefundResponse['creditnote_refund']> {
      const { creditnote_refund } = await http.get<GetCreditNoteRefundResponse>({
        path: ['creditnotes', creditnoteId, 'refunds', creditnoteRefundId],
      })
      return creditnote_refund
    },

    async updateRefund(
      creditnoteId: string,
      creditnoteRefundId: string,
      data: UpdateCreditNoteRefundRequest
    ): Promise<UpdateCreditNoteRefundResponse['creditnote_refund']> {
      const { creditnote_refund } = await http.put<UpdateCreditNoteRefundResponse>({
        path: ['creditnotes', creditnoteId, 'refunds', creditnoteRefundId],
        body: data,
      })
      return creditnote_refund
    },

    async deleteRefund(creditnoteId: string, creditnoteRefundId: string): Promise<void> {
      await http.delete({
        path: ['creditnotes', creditnoteId, 'refunds', creditnoteRefundId],
      })
    },
  }
}

export type CreditNotes = ReturnType<typeof createCreditNotes>
