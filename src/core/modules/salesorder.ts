import type { HttpClient } from '@/client';
import { MODULES } from '@/core/constants';
import type { PaginatedResponse } from '@/types';
import type { CreateSalesOrder, ListSalesOrder, SalesOrder } from '@/types/salesorder';

export class SalesOrderResource {
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  async get(orderId: string): Promise<SalesOrder> {
    const res = await this.http.get<{ salesorder: SalesOrder }>({
      path: [MODULES.SALES_ORDER.PATH, orderId],
    });
    return res[MODULES.SALES_ORDER.RESPONSE_KEY.SINGULAR];
  }

  async create(
    order: CreateSalesOrder,
    { ignore_auto_number_generation }: { ignore_auto_number_generation: boolean },
  ): Promise<SalesOrder> {
    const res = await this.http.post<{ salesorder: SalesOrder }>({
      path: [MODULES.SALES_ORDER.PATH],
      body: order,
      query: {
        ignore_auto_number_generation,
      },
    });

    return res[MODULES.SALES_ORDER.RESPONSE_KEY.SINGULAR];
  }

  async update(
    orderId: string,
    order: CreateSalesOrder,
    { ignore_auto_number_generation }: { ignore_auto_number_generation: boolean },
  ): Promise<SalesOrder> {
    const res = await this.http.put<{ salesorder: SalesOrder }>({
      path: [MODULES.SALES_ORDER.PATH, orderId],
      body: order,
      query: {
        ignore_auto_number_generation,
      },
    });

    return res[MODULES.SALES_ORDER.RESPONSE_KEY.SINGULAR];
  }

  async delete(orderId: string) {
    return this.http.delete({
      path: [MODULES.SALES_ORDER.PATH, orderId],
    });
  }

  async markAsConfirmed(orderId: string) {
    return this.http.post({
      path: [MODULES.SALES_ORDER.PATH, orderId, 'status', 'confirmed'],
    });
  }

  async markAsVoid(orderId: string, reason: string) {
    return this.http.post({
      path: [MODULES.SALES_ORDER.PATH, orderId, 'status', 'void'],
      body: { reason },
    });
  }

  /* Searches for salesorders based on provided filters.
   * * @experimental This search implementation is currently experimental.
   * Supported query parameters and behavior may change in future releases.
   * * @param options - The search filters and pagination parameters.
   * @returns A paginated response containing the matching salesorders.
   */
  async search(options: {
    page?: number;
    per_page?: number;
    sort_column?: string;
    sort_order: 'A' | 'D';
    customer_id?: string;
    reference_number_contains?: string;
    salesorder_number_contains?: string;
    created_date_start?: string;
    created_date_end?: string;
    [key: string]: string | number | boolean | undefined;
  }) {
    const cleanQuery = Object.fromEntries(
      Object.entries(options).filter(([_, value]) => value !== undefined),
    ) as Record<string, string | number | boolean>;
    return this.http.get<PaginatedResponse<{ salesorders: ListSalesOrder[] }>>({
      path: [MODULES.SALES_ORDER.PATH],
      query: cleanQuery,
    });
  }
}
