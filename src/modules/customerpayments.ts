import type { ApiClient } from '../client';
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  DeletePaymentResponse,
  ListCustomerPaymentsResponse,
  RetrievePaymentResponse,
  UpdatePaymentRequest,
  UpdatePaymentResponse,
} from '../types/customerpayment';

export class CustomerPaymentModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Lists all the Customer Payments.
   * If opts.limit is provided, return at most that many items.
   */
  async list(
    opts: {
      customerName?: string;
      referenceNumber?: string;
      date?: string; // Format: yyyy-mm-dd
      amount?: number;
      notes?: string;
      paymentMode?: string;
      filterBy?: string;
      sortColumn?:
        | 'date'
        | 'created_time'
        | 'total'
        | 'reference_number'
        | 'customer_name';
      sortOrder?: 'ascending' | 'descending';
      limit?: number;
    } = {}
  ): Promise<ListCustomerPaymentsResponse['customerpayments']> {
    const params: Record<string, any> = {};

    if (opts.customerName) params.customer_name = opts.customerName;
    if (opts.referenceNumber) params.reference_number = opts.referenceNumber;
    if (opts.date) params.date = opts.date;
    if (opts.amount) params.amount = opts.amount;
    if (opts.notes) params.notes = opts.notes;
    if (opts.paymentMode) params.payment_mode = opts.paymentMode;
    if (opts.filterBy) params.filter_by = opts.filterBy;

    if (opts.sortColumn) params.sort_column = opts.sortColumn;
    if (opts.sortOrder)
      params.sort_order = opts.sortOrder === 'ascending' ? 'A' : 'D';

    return this.client.getList({
      path: ['customerpayments'],
      params,
      limit: opts.limit,
      extractor: (res: ListCustomerPaymentsResponse) =>
        res.customerpayments ?? [],
    });
  }

  /**
   * Create a new payment.
   */
  async create(
    payment: CreatePaymentRequest
  ): Promise<CreatePaymentResponse['payment']> {
    const res = await this.client.post<CreatePaymentResponse>({
      path: ['customerpayments'],
      body: payment,
    });

    return res.payment;
  }

  /**
   * Retrieve a payment by ID.
   */
  async get(paymentId: string): Promise<RetrievePaymentResponse['payment']> {
    const res = await this.client.get<{
      payment: RetrievePaymentResponse['payment'];
    }>({
      path: ['customerpayments', paymentId],
    });

    return res.payment;
  }

  /**
   * Update an existing payment.
   */
  async update(
    paymentId: string,
    payment: UpdatePaymentRequest
  ): Promise<UpdatePaymentResponse['payment']> {
    const res = await this.client.put<UpdatePaymentResponse>({
      path: ['customerpayments', paymentId],
      body: payment,
    });

    return res.payment;
  }

  /**
   * Delete a payment.
   */
  async delete(paymentId: string): Promise<DeletePaymentResponse> {
    const res = await this.client.delete<DeletePaymentResponse>({
      path: ['customerpayments', paymentId],
    });

    return res;
  }
}
