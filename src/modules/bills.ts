import type { ApiClient } from '../client';
import type { CustomField } from './types';
import type {
  ListAllBillsResponse,
  CreateBillRequest,
  CreateBillResponse,
  RetrieveBillResponse,
  UpdateBillRequest,
  UpdateBillResponse,
  DeleteBillResponse,
  UpdateBillCustomfieldResponse,
  MarkAsOpenResponse,
  MarkAsVoidResponse,
} from '../types/bill';

export class BillModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * List all Bills.
   */
  async list(opts?: {
    limit?: number;
  }): Promise<ListAllBillsResponse['bills']> {
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
  async delete(billId: string): Promise<DeleteBillResponse> {
    return this.client.delete<DeleteBillResponse>({
      path: ['bills', billId],
    });
  }

  /**
   * Update custom field in existing bills.
   */
  async updateCustomField(
    billId: string,
    customFields: CustomField[]
  ): Promise<UpdateBillCustomfieldResponse> {
    return this.client.put<UpdateBillCustomfieldResponse>({
      path: ['bill', billId, 'customfields'],
      body: customFields,
    });
  }

  /**
   * Mark as Open.
   */
  async markAsOpen(billId: string): Promise<MarkAsOpenResponse> {
    return this.client.post<MarkAsOpenResponse>({
      path: ['bills', billId, 'status', 'open'],
    });
  }

  /**
   * Mark as Void.
   */
  async markAsVoid(billId: string): Promise<MarkAsVoidResponse> {
    return this.client.post<MarkAsVoidResponse>({
      path: ['bills', billId, 'status', 'void'],
    });
  }
}
