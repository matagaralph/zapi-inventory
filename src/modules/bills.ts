import type { ApiClient } from '../client';
import type {
  CreateBillRequest,
  CreateBillResponse,
  ListAllBillsResponse,
  RetrieveBillResponse,
  UpdateBillRequest,
  UpdateBillResponse,
} from '../types/bill';
import type { CustomField } from './types';

export class BillModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * List all Bills.
   */
  list(opts?: { limit?: number }): Promise<ListAllBillsResponse['bills']> {
    return this.client.getList({
      path: ['bills'],
      limit: opts?.limit,
      extractor: (res: ListAllBillsResponse) => res.bills ?? [],
    });
  }

  /**
   * Create a Bill.
   */
  async create(bill: CreateBillRequest): Promise<CreateBillResponse['bill']> {
    const res = await this.client.post<CreateBillResponse>({
      path: ['bills'],
      body: bill,
    });
    return res.bill;
  }

  /**
   * Retrieve a Bill.
   */
  async get(billId: string): Promise<RetrieveBillResponse['bill']> {
    const res = await this.client.get<RetrieveBillResponse>({
      path: ['bills', billId],
    });
    return res.bill;
  }

  /**
   * Update a Bill.
   */
  async update(
    billId: string,
    bill: UpdateBillRequest
  ): Promise<UpdateBillResponse['bill']> {
    const res = await this.client.put<UpdateBillResponse>({
      path: ['bills', billId],
      body: bill,
    });
    return res.bill;
  }

  /**
   * Delete a Bill.
   */
  delete(billId: string): Promise<void> {
    return this.client.delete({
      path: ['bills', billId],
    });
  }

  /**
   * Update custom field in existing bills.
   */
  updateCustomField(
    billId: string,
    customFields: CustomField[]
  ): Promise<void> {
    return this.client.put({
      path: ['bills', billId, 'customfields'],
      body: customFields,
    });
  }

  /**
   * Mark as Open.
   */
  markAsOpen(billId: string): Promise<void> {
    return this.client.post({
      path: ['bills', billId, 'status', 'open'],
    });
  }

  /**
   * Mark as Void.
   */
  markAsVoid(billId: string): Promise<void> {
    return this.client.post({
      path: ['bills', billId, 'status', 'void'],
    });
  }
}
