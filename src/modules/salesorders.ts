import type { ApiClient } from '../client';
import type {
  BulkConfirmSalesordersResponse,
  CreateSalesOrderRequest,
  CreateSalesOrderResponse,
  ListAllSalesOrdersResponse,
  RetrieveSalesOrderResponse,
  UpdateSalesOrderRequest,
  UpdateSalesOrderResponse,
} from '../types/salesorder';

export class SalesOrderModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Lists all the available Sales Orders in Zoho Inventory.
   * If opts.limit is provided, return at most that many items.
   */
  async list(opts?: {
    created_date_start?: string;
    created_date_end?: string;
    sort_column?: 'date' | 'created_time' | 'last_modified_time' | 'total';
    sort_order?: 'A' | 'D';
    limit?: number;
    last_modified_time?: string;
    customer_id?: string;
  }): Promise<ListAllSalesOrdersResponse['salesorders']> {
    const { limit, ...params } = opts ?? {};

    return this.client.getList({
      path: ['salesorders'],
      params,
      limit,
      extractor: (res: ListAllSalesOrdersResponse) => res.salesorders ?? [],
    });
  }

  async create(
    salesOrder: CreateSalesOrderRequest,
    opts?: { ignore_auto_number_generation?: boolean }
  ): Promise<CreateSalesOrderResponse['sales_order']> {
    const res = await this.client.post<CreateSalesOrderResponse>({
      path: ['salesorders'],
      body: salesOrder,
      params: opts,
    });

    return res.sales_order;
  }

  async get(
    salesorderId: string
  ): Promise<RetrieveSalesOrderResponse['salesorder']> {
    const res = await this.client.get<RetrieveSalesOrderResponse>({
      path: ['salesorders', salesorderId],
    });

    return res.salesorder;
  }

  async update(
    salesorderId: string,
    salesOrder: UpdateSalesOrderRequest,
    opts?: { ignore_auto_number_generation?: boolean }
  ): Promise<UpdateSalesOrderResponse['sales_order']> {
    const res = await this.client.put<UpdateSalesOrderResponse>({
      path: ['salesorders', salesorderId],
      body: salesOrder,
      params: opts,
    });

    return res.sales_order;
  }

  async delete(salesorderId: string): Promise<void> {
    await this.client.delete({
      path: ['salesorders', salesorderId],
    });
  }

  async markAsConfirmed(salesorderId: string): Promise<void> {
    await this.client.post({
      path: ['salesorders', salesorderId, 'status', 'confirmed'],
    });
  }

  async markAsVoid(salesorderId: string): Promise<void> {
    await this.client.post({
      path: ['salesorders', salesorderId, 'status', 'void'],
    });
  }

  async bulkConfirm(
    salesorderIds: string[]
  ): Promise<BulkConfirmSalesordersResponse> {
    const res = await this.client.post<BulkConfirmSalesordersResponse>({
      path: ['salesorders', 'status', 'confirmed'],
      params: { salesorder_ids: salesorderIds.join(',') },
    });
    return res;
  }

  async bulkDelete(salesorderIds: string[]): Promise<void> {
    await this.client.delete({
      path: ['salesorders'],
      params: { salesorder_ids: salesorderIds.join(',') },
    });
  }
}
