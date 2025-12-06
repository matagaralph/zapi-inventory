import type { ApiClient } from '../client';
import type {
  BulkConfirmSalesordersResponse,
  BulkDeleteSalesOrdersResponse,
  CreateSalesOrderRequest,
  CreateSalesOrderResponse,
  DeleteSalesOrderResponse,
  ListAllSalesOrdersResponse,
  MarkAsConfirmedResponse,
  MarkAsVoidResponse,
  RetrieveSalesOrderResponse,
  UpdateSalesOrderRequest,
  UpdateSalesOrderResponse,
} from '../types/salesorder';
import { toZohoIsoString } from '../utils/format';

export class SalesOrderModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Lists all the available Sales Orders in Zoho Inventory.
   * If opts.limit is provided, return at most that many items.
   */
  async list(opts: {
    createdDateStart: string;
    createdDateEnd: string;
    sortColumn?: 'date' | 'created_time' | 'last_modified_time' | 'total';
    sortOrder?: 'ascending' | 'descending';
    limit?: number;
    lastModifiedTime?: Date;
    customerId?: string;
  }): Promise<ListAllSalesOrdersResponse['salesorders']> {
    if (!opts.createdDateStart) {
      throw new Error('createdDateStart is required');
    }
    if (!opts.createdDateEnd) {
      throw new Error('createdDateEnd is required');
    }

    const params: Record<string, any> = {
      created_date_start: opts.createdDateStart,
      created_date_end: opts.createdDateEnd,
    };

    if (opts.customerId) params.customer_id = opts.customerId;
    if (opts.sortColumn) params.sort_column = opts.sortColumn;
    if (opts.sortOrder)
      params.sort_order = opts.sortOrder === 'ascending' ? 'A' : 'D';

    if (opts.lastModifiedTime) {
      params.last_modified_time = toZohoIsoString(opts.lastModifiedTime);
    }

    return this.client.getList({
      path: ['salesorders'],
      params,
      limit: opts.limit,
      extractor: (res: ListAllSalesOrdersResponse) => res.salesorders ?? [],
    });
  }

  async create(
    salesOrder: CreateSalesOrderRequest,
    opts?: { ignore_auto_number_generation?: boolean }
  ): Promise<CreateSalesOrderResponse['sales_order']> {
    const params: Record<string, any> = {};
    if (opts?.ignore_auto_number_generation)
      params.ignore_auto_number_generation = opts.ignore_auto_number_generation;
    const res = await this.client.post<CreateSalesOrderResponse>({
      path: ['salesorders'],
      body: salesOrder,
      params,
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
    const params: Record<string, any> = {};
    if (opts?.ignore_auto_number_generation)
      params.customer_id = opts.ignore_auto_number_generation;
    const res = await this.client.put<UpdateSalesOrderResponse>({
      path: ['salesorders', salesorderId],
      body: salesOrder,
      params,
    });

    return res.sales_order;
  }

  async delete(salesorderId: string): Promise<DeleteSalesOrderResponse> {
    const res = await this.client.delete<DeleteSalesOrderResponse>({
      path: ['salesorders', salesorderId],
    });

    return res;
  }

  async markAsConfirmed(
    salesorderId: string
  ): Promise<MarkAsConfirmedResponse> {
    const res = await this.client.post<MarkAsConfirmedResponse>({
      path: ['salesorders', salesorderId, 'status', 'confirmed'],
    });
    return res;
  }

  async markAsVoid(salesorderId: string): Promise<MarkAsVoidResponse> {
    const res = await this.client.post<MarkAsVoidResponse>({
      path: ['salesorders', salesorderId, 'status', 'void'],
    });
    return res;
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

  async bulkDelete(
    salesorderIds: string[]
  ): Promise<BulkDeleteSalesOrdersResponse> {
    const res = await this.client.delete<BulkDeleteSalesOrdersResponse>({
      path: ['salesorders'],
      params: { salesorder_ids: salesorderIds.join(',') },
    });
    return res;
  }
}
