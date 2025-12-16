import type { ApiClient } from '../client';
import type {
  ListAllTheItemsResponse,
  CreateItemRequest,
  CreateItemResponse,
  RetrieveItemResponse,
  UpdateItemRequest,
  UpdateItemResponse,
  BulkFetchItemDetailsResponse,
} from '../types/item';
import type { CustomField } from './types';

export class ItemModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * List all the items.
   */
  async list(opts?: {
    limit?: number;
    filter_by_status?: 'active' | 'inactive';
    category_id?: string;
    vendor_id?: string;
    integration_name?: string;
    integration_id?: string;
    manufacturer?: string;
    brand?: string;
    ean_contains?: string;
    sku_contains?: string;
    name_contains?: string;
    sort_column?: 'created_time' | 'last_modified_time';
    sort_order?: 'A' | 'D';
  }): Promise<ListAllTheItemsResponse['items']> {
    const { limit, ...params } = opts ?? {};
    return this.client.getList({
      path: ['items'],
      params,
      limit,
      extractor: (res: ListAllTheItemsResponse) => res.items ?? [],
    });
  }

  /**
   * Create an item.
   */
  async create(item: CreateItemRequest): Promise<CreateItemResponse['item']> {
    const res = await this.client.post<CreateItemResponse>({
      path: ['items'],
      body: item,
    });
    return res.item;
  }

  /**
   * Retrieve an item.
   */
  async get(itemId: string): Promise<RetrieveItemResponse['item']> {
    const res = await this.client.get<RetrieveItemResponse>({
      path: ['items', itemId],
    });
    return res.item;
  }

  /**
   * Bulk fetch item details.
   */
  async getMany(
    itemIds: string[]
  ): Promise<BulkFetchItemDetailsResponse['items']> {
    const res = await this.client.get<BulkFetchItemDetailsResponse>({
      path: ['itemdetails'],
      params: {
        item_ids: itemIds.join(','),
      },
    });
    return res.items;
  }

  /**
   * Update an item.
   */
  async update(
    itemId: string,
    item: UpdateItemRequest
  ): Promise<UpdateItemResponse['item']> {
    const res = await this.client.put<UpdateItemResponse>({
      path: ['items', itemId],
      body: item,
    });
    return res.item;
  }

  /**
   * Delete an item.
   */
  delete(itemId: string): Promise<void> {
    return this.client.delete({
      path: ['items', itemId],
    });
  }

  /**
   * Update custom field in existing items.
   */
  updateCustomField(itemId: string, customFields: CustomField): Promise<void> {
    return this.client.put({
      path: ['item', itemId, 'customfields'],
      body: customFields,
    });
  }

  /**
   * Delete an item image.
   */
  deleteImage(itemId: string): Promise<void> {
    return this.client.delete({
      path: ['items', itemId, 'image'],
    });
  }

  /**
   * Mark as active.
   */
  markActive(itemId: string): Promise<void> {
    return this.client.post({
      path: ['items', itemId, 'active'],
    });
  }

  /**
   * Mark as inactive.
   */
  markInactive(itemId: string): Promise<void> {
    return this.client.post({
      path: ['items', itemId, 'inactive'],
    });
  }
}
