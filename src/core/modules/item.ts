import type { HttpClient } from '@/client';
import { MODULES } from '@/core/constants';
import { chunkArray } from '@/core/utils';
import type { PaginatedResponse } from '@/types';
import type { CreateItem, Item, ItemDetail, ListItem, UpdateItem } from '@/types/item';

export interface ItemSearchOptions {
  page?: number;
  per_page?: number;
  sort_column?: string;
  sort_order?: 'A' | 'D';
  sku_contains?: string;
  brand?: string;
  category_id?: string;
  manufacturer?: string;
  [key: string]: string | number | boolean | undefined;
}

export class ItemResource {
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  async get(id: string): Promise<Item> {
    const res = await this.http.get<{ item: Item }>({
      path: [MODULES.ITEM.PATH, id],
    });
    return res[MODULES.ITEM.RESPONSE_KEY.SINGULAR];
  }

  async create(item: CreateItem): Promise<Item> {
    const res = await this.http.post<{ item: Item }>({
      path: [MODULES.ITEM.PATH],
      body: item,
    });
    return res[MODULES.ITEM.RESPONSE_KEY.SINGULAR];
  }

  async update(itemId: string, item: UpdateItem): Promise<Item> {
    const res = await this.http.put<{ item: Item }>({
      path: [MODULES.ITEM.PATH, itemId],
      body: item,
    });
    return res[MODULES.ITEM.RESPONSE_KEY.SINGULAR];
  }

  /**
   * Bulk fetch item details.
   */
  async getMany(itemIds: string[]): Promise<ItemDetail[]> {
    const allItems: ItemDetail[] = [];

    const chunks = chunkArray(itemIds, 5);

    for (const chunk of chunks) {
      const result = await this.http.get<{ items: ItemDetail[] }>({
        path: ['itemdetails'],
        query: {
          item_ids: chunk.join(','),
        },
      });

      allItems.push(...result.items);
    }

    return allItems;
  }

  delete(itemId: string): Promise<void> {
    return this.http.delete({
      path: [MODULES.ITEM.PATH, itemId],
    });
  }

  markActive(itemId: string): Promise<void> {
    return this.http.post({
      path: [MODULES.ITEM.PATH, itemId, 'active'],
    });
  }

  markInactive(itemId: string): Promise<void> {
    return this.http.post({
      path: [MODULES.ITEM.PATH, itemId, 'inactive'],
    });
  }
  /* Searches for items based on provided filters.
   * * @experimental This search implementation is currently experimental.
   * Supported query parameters and behavior may change in future releases.
   * * @param options - The search filters and pagination parameters.
   * @returns A paginated response containing the matching items.
   */
  async search(options: ItemSearchOptions) {
    const cleanQuery = Object.fromEntries(
      Object.entries(options).filter(([_, value]) => value !== undefined),
    ) as Record<string, string | number | boolean>;
    return this.http.get<PaginatedResponse<{ items: ListItem[] }>>({
      path: [MODULES.ITEM.PATH],
      query: cleanQuery,
    });
  }
}
