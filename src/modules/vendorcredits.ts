import type { ApiClient } from '../client';
import type {
  AddCommentRequest,
  AddCommentResponse,
  ApplyCreditsToBillRequest,
  ApplyCreditsToBillResponse,
  CreateVendorCreditRequest,
  CreateVendorCreditResponse,
  GetVendorCreditRefundResponse,
  GetVendorCreditResponse,
  ListBillsCreditedResponse,
  ListRefundsOfVendorCreditResponse,
  ListVendorCreditCommentsAndHistoryResponse,
  ListVendorCreditRefundsResponse,
  ListVendorCreditsResponse,
  RefundVendorCreditRequest,
  RefundVendorCreditResponse,
  UpdateVendorCreditRefundRequest,
  UpdateVendorCreditRefundResponse,
  UpdateVendorCreditRequest,
  UpdateVendorCreditResponse,
} from '../types/vendorcredit';

export class VendorCreditModule {
  constructor(private client: ApiClient) {}

  async list(opts?: {
    limit: number;
  }): Promise<ListVendorCreditsResponse['vendorcredits']> {
    return this.client.getList({
      path: ['vendorcredits'],
      limit: opts?.limit,
      extractor: (res: ListVendorCreditsResponse) => res.vendorcredits ?? [],
    });
  }

  async create(
    data: CreateVendorCreditRequest,
    opts?: {
      billId?: string;
      ignoreAutoNumberGeneration: boolean;
    }
  ): Promise<CreateVendorCreditResponse['vendor_credit']> {
    const res = await this.client.post<CreateVendorCreditResponse>({
      path: ['vendorcredits'],
      params: {
        bill_id: opts?.billId ?? '',
        ignore_auto_number_generation:
          opts?.ignoreAutoNumberGeneration ?? false,
      },
      body: data,
    });
    return res.vendor_credit;
  }

  async get(
    vendorCreditId: string,
    opts?: { print?: boolean; accept?: string }
  ): Promise<GetVendorCreditResponse['vendor_credit']> {
    const res = await this.client.get<GetVendorCreditResponse>({
      path: ['vendorcredits', vendorCreditId],
      params: opts,
    });
    return res.vendor_credit;
  }

  async update(
    vendorCreditId: string,
    data: UpdateVendorCreditRequest
  ): Promise<UpdateVendorCreditResponse['vendor_credit']> {
    const res = await this.client.put<UpdateVendorCreditResponse>({
      path: ['vendorcredits', vendorCreditId],
      body: data,
    });
    return res.vendor_credit;
  }

  delete(vendorCreditId: string): Promise<void> {
    return this.client.delete({
      path: ['vendorcredits', vendorCreditId],
    });
  }

  markOpen(vendorCreditId: string): Promise<void> {
    return this.client.post({
      path: ['vendorcredits', vendorCreditId, 'status', 'open'],
    });
  }

  markVoid(vendorCreditId: string): Promise<void> {
    return this.client.post({
      path: ['vendorcredits', vendorCreditId, 'status', 'void'],
    });
  }

  submit(vendorCreditId: string): Promise<void> {
    return this.client.post({
      path: ['vendorcredits', vendorCreditId, 'submit'],
    });
  }

  approve(vendorCreditId: string): Promise<void> {
    return this.client.post({
      path: ['vendorcredits', vendorCreditId, 'approve'],
    });
  }

  async listBillsCredited(
    vendorCreditId: string
  ): Promise<ListBillsCreditedResponse['bills_credited']> {
    const res = await this.client.get<ListBillsCreditedResponse>({
      path: ['vendorcredits', vendorCreditId, 'bills'],
    });
    return res.bills_credited ?? [];
  }

  async applyToBill(
    vendorCreditId: string,
    data: ApplyCreditsToBillRequest
  ): Promise<ApplyCreditsToBillResponse> {
    return this.client.post({
      path: ['vendorcredits', vendorCreditId, 'bills'],
      body: data,
    });
  }

  deleteCreditedBill(
    vendorCreditId: string,
    vendorCreditBillId: string
  ): Promise<void> {
    return this.client.delete({
      path: ['vendorcredits', vendorCreditId, 'bills', vendorCreditBillId],
    });
  }

  async listRefunds(
    vendorCreditId: string
  ): Promise<ListRefundsOfVendorCreditResponse['vendor_credit_refunds']> {
    const res = await this.client.get<ListRefundsOfVendorCreditResponse>({
      path: ['vendorcredits', vendorCreditId, 'refunds'],
    });
    return res.vendor_credit_refunds ?? [];
  }

  async refund(
    vendorCreditId: string,
    data: RefundVendorCreditRequest
  ): Promise<RefundVendorCreditResponse['vendor_credit_refund']> {
    const res = await this.client.post<RefundVendorCreditResponse>({
      path: ['vendorcredits', vendorCreditId, 'refunds'],
      body: data,
    });
    return res.vendor_credit_refund;
  }

  async getRefund(
    vendorCreditId: string,
    vendorCreditRefundId: string
  ): Promise<GetVendorCreditRefundResponse['vendor_credit_refund']> {
    const res = await this.client.get<GetVendorCreditRefundResponse>({
      path: ['vendorcredits', vendorCreditId, 'refunds', vendorCreditRefundId],
    });
    return res.vendor_credit_refund;
  }

  async updateRefund(
    vendorCreditId: string,
    vendorCreditRefundId: string,
    data: UpdateVendorCreditRefundRequest
  ): Promise<UpdateVendorCreditRefundResponse['vendor_credit_refund']> {
    const res = await this.client.put<UpdateVendorCreditRefundResponse>({
      path: ['vendorcredits', vendorCreditId, 'refunds', vendorCreditRefundId],
      body: data,
    });
    return res.vendor_credit_refund;
  }

  deleteRefund(
    vendorCreditId: string,
    vendorCreditRefundId: string
  ): Promise<void> {
    return this.client.delete({
      path: ['vendorcredits', vendorCreditId, 'refunds', vendorCreditRefundId],
    });
  }

  async listRefundsGlobal(
    params?: Record<string, string | number>
  ): Promise<ListVendorCreditRefundsResponse['vendor_credit_refunds']> {
    return this.client.getList({
      path: ['vendorcredits', 'refunds'],
      params,
      extractor: (res: ListVendorCreditRefundsResponse) =>
        res.vendor_credit_refunds ?? [],
    });
  }

  async listComments(
    vendorCreditId: string
  ): Promise<ListVendorCreditCommentsAndHistoryResponse['comments']> {
    const res =
      await this.client.get<ListVendorCreditCommentsAndHistoryResponse>({
        path: ['vendorcredits', vendorCreditId, 'comments'],
      });
    return res.comments ?? [];
  }

  async addComment(
    vendorCreditId: string,
    data: AddCommentRequest
  ): Promise<AddCommentResponse['comment']> {
    const res = await this.client.post<AddCommentResponse>({
      path: ['vendorcredits', vendorCreditId, 'comments'],
      body: data,
    });
    return res.comment;
  }

  deleteComment(vendorCreditId: string, commentId: string): Promise<void> {
    return this.client.delete({
      path: ['vendorcredits', vendorCreditId, 'comments', commentId],
    });
  }
}
