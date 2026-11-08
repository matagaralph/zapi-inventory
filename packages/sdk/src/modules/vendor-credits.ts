import type {
  ApplyCreditsToBillRequest,
  ApplyCreditsToBillResponse,
  CreateVendorCreditQuery,
  CreateVendorCreditRequest,
  CreateVendorCreditResponse,
  GetVendorCreditQuery,
  GetVendorCreditRefundResponse,
  GetVendorCreditResponse,
  ListBillsCreditedResponse,
  ListRefundsOfVendorCreditResponse,
  ListRefundsOfVendorCreditQuery,
  ListRefundsOfVendorCreditsQuery,
  ListVendorCreditCommentsAndHistoryResponse,
  ListVendorCreditRefundsResponse,
  ListVendorCreditsQuery,
  ListVendorCreditsResponse,
  RefundVendorCreditRequest,
  RefundVendorCreditResponse,
  UpdateVendorCreditRefundRequest,
  UpdateVendorCreditRefundResponse,
  UpdateVendorCreditRequest,
  UpdateVendorCreditResponse,
  VendorCreditsAddCommentRequest,
  VendorCreditsAddCommentResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * Vendor credits are credits that you receive from your vendor, and is treated as an equivalent of physical cash that the vendor owes you. This helps you track the money you're owed until it is either paid by said vendor at a later date i.e refunded, or subtracted from any future bill amount due to that vendor.
 */
export function createVendorCredits(http: HTTPClient) {
  return {
    async list(
      params?: ListVendorCreditsQuery
    ): Promise<ListVendorCreditsResponse['vendorcredits']> {
      const { vendorcredits } = await http.get<ListVendorCreditsResponse>({
        path: ['vendorcredits'],
        query: { ...params },
      })
      return vendorcredits
    },

    async create(
      data: CreateVendorCreditRequest,
      params?: CreateVendorCreditQuery
    ): Promise<CreateVendorCreditResponse['vendor_credit']> {
      const { vendor_credit } = await http.post<CreateVendorCreditResponse>({
        path: ['vendorcredits'],
        query: { ...params },
        body: data,
      })
      return vendor_credit
    },

    async get(
      vendorCreditId: string,
      params?: GetVendorCreditQuery
    ): Promise<GetVendorCreditResponse['vendor_credit']> {
      const { vendor_credit } = await http.get<GetVendorCreditResponse>({
        path: ['vendorcredits', vendorCreditId],
        query: { ...params },
      })
      return vendor_credit
    },

    async update(
      vendorCreditId: string,
      data: UpdateVendorCreditRequest
    ): Promise<UpdateVendorCreditResponse['vendor_credit']> {
      const { vendor_credit } = await http.put<UpdateVendorCreditResponse>({
        path: ['vendorcredits', vendorCreditId],
        body: data,
      })
      return vendor_credit
    },

    async delete(vendorCreditId: string): Promise<void> {
      await http.delete({ path: ['vendorcredits', vendorCreditId] })
    },

    async markAsOpen(vendorCreditId: string): Promise<void> {
      await http.post({
        path: ['vendorcredits', vendorCreditId, 'status', 'open'],
      })
    },

    async markAsVoid(vendorCreditId: string): Promise<void> {
      await http.post({
        path: ['vendorcredits', vendorCreditId, 'status', 'void'],
      })
    },

    async submit(vendorCreditId: string): Promise<void> {
      await http.post({
        path: ['vendorcredits', vendorCreditId, 'submit'],
      })
    },

    async approve(vendorCreditId: string): Promise<void> {
      await http.post({
        path: ['vendorcredits', vendorCreditId, 'approve'],
      })
    },

    async listBills(vendorCreditId: string): Promise<ListBillsCreditedResponse['bills_credited']> {
      const { bills_credited } = await http.get<ListBillsCreditedResponse>({
        path: ['vendorcredits', vendorCreditId, 'bills'],
      })
      return bills_credited
    },

    async applyToBill(
      vendorCreditId: string,
      data: ApplyCreditsToBillRequest
    ): Promise<ApplyCreditsToBillResponse> {
      return http.post<ApplyCreditsToBillResponse>({
        path: ['vendorcredits', vendorCreditId, 'bills'],
        body: data,
      })
    },

    async deleteBill(vendorCreditId: string, vendorCreditBillId: string): Promise<void> {
      await http.delete({
        path: ['vendorcredits', vendorCreditId, 'bills', vendorCreditBillId],
      })
    },

    async listRefunds(
      vendorCreditId: string,
      params?: ListRefundsOfVendorCreditQuery
    ): Promise<ListRefundsOfVendorCreditResponse['vendor_credit_refunds']> {
      const { vendor_credit_refunds } = await http.get<ListRefundsOfVendorCreditResponse>({
        path: ['vendorcredits', vendorCreditId, 'refunds'],
        query: { ...params },
      })
      return vendor_credit_refunds
    },

    async createRefund(
      vendorCreditId: string,
      data: RefundVendorCreditRequest
    ): Promise<RefundVendorCreditResponse['vendor_credit_refund']> {
      const { vendor_credit_refund } = await http.post<RefundVendorCreditResponse>({
        path: ['vendorcredits', vendorCreditId, 'refunds'],
        body: data,
      })
      return vendor_credit_refund
    },

    async getRefund(
      vendorCreditId: string,
      vendorCreditRefundId: string
    ): Promise<GetVendorCreditRefundResponse['vendor_credit_refund']> {
      const { vendor_credit_refund } = await http.get<GetVendorCreditRefundResponse>({
        path: ['vendorcredits', vendorCreditId, 'refunds', vendorCreditRefundId],
      })
      return vendor_credit_refund
    },

    async updateRefund(
      vendorCreditId: string,
      vendorCreditRefundId: string,
      data: UpdateVendorCreditRefundRequest
    ): Promise<UpdateVendorCreditRefundResponse['vendor_credit_refund']> {
      const { vendor_credit_refund } = await http.put<UpdateVendorCreditRefundResponse>({
        path: ['vendorcredits', vendorCreditId, 'refunds', vendorCreditRefundId],
        body: data,
      })
      return vendor_credit_refund
    },

    async deleteRefund(vendorCreditId: string, vendorCreditRefundId: string): Promise<void> {
      await http.delete({
        path: ['vendorcredits', vendorCreditId, 'refunds', vendorCreditRefundId],
      })
    },

    async listAllRefunds(
      params?: ListRefundsOfVendorCreditsQuery
    ): Promise<ListVendorCreditRefundsResponse['vendor_credit_refunds']> {
      const { vendor_credit_refunds } = await http.get<ListVendorCreditRefundsResponse>({
        path: ['vendorcredits', 'refunds'],
        query: { ...params },
      })
      return vendor_credit_refunds
    },

    async listComments(
      vendorCreditId: string
    ): Promise<ListVendorCreditCommentsAndHistoryResponse['comments']> {
      const { comments } = await http.get<ListVendorCreditCommentsAndHistoryResponse>({
        path: ['vendorcredits', vendorCreditId, 'comments'],
      })
      return comments
    },

    async addComment(
      vendorCreditId: string,
      data: VendorCreditsAddCommentRequest
    ): Promise<VendorCreditsAddCommentResponse['comment']> {
      const { comment } = await http.post<VendorCreditsAddCommentResponse>({
        path: ['vendorcredits', vendorCreditId, 'comments'],
        body: data,
      })
      return comment
    },

    async deleteComment(vendorCreditId: string, commentId: string): Promise<void> {
      await http.delete({
        path: ['vendorcredits', vendorCreditId, 'comments', commentId],
      })
    },
  }
}

export type VendorCredits = ReturnType<typeof createVendorCredits>
