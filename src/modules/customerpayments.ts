import type { ApiClient } from '../client';
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
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
   */
  async list(opts?: {
    customer_name?: string;
    reference_number?: string;
    date?: string; // Format: yyyy-mm-dd
    amount?: number;
    notes?: string;
    payment_mode?: string;
    filter_by?: string;
    sort_column?:
      | 'date'
      | 'created_time'
      | 'total'
      | 'reference_number'
      | 'customer_name';
    sort_order?: 'A' | 'D';
    limit?: number;
  }): Promise<ListCustomerPaymentsResponse['customerpayments']> {
    const { limit, ...params } = opts ?? {};
    return this.client.getList({
      path: ['customerpayments'],
      params,
      limit: limit,
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
  delete(paymentId: string): Promise<void> {
    return this.client.delete({
      path: ['customerpayments', paymentId],
    });
  }
}
