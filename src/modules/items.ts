import type { ApiClient } from '../client';
import type {
  ListAllTheItemsResponse,
  CreateItemRequest,
  CreateItemResponse,
  RetrieveItemResponse,
  UpdateItemRequest,
  UpdateItemResponse,
  DeleteItemResponse,
  BulkFetchItemDetailsResponse,
  UpdateItemCustomfieldResponse,
  DeleteItemImageResponse,
  MarkAsActiveResponse,
  MarkAsInactiveResponse,
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
    filterByStatus?: 'active' | 'inactive';
    categoryId?: string;
    vendorId?: string;
    integrationName?: string;
    integrationId?: string;
    manufacturer?: string;
    brand?: string;
    eanContains?: string;
    skuContains?: string;
    nameContains?: string;
    sortColumn?: 'created_time' | 'last_modified_time';
    sortOrder?: 'ascending' | 'descending';
  }): Promise<ListAllTheItemsResponse['items']> {
    return this.client.getList({
      path: ['items'],
      params: {
        sort_column: opts?.sortColumn ?? 'created_time',
        sort_order: opts?.sortOrder === 'ascending' ? 'A' : 'D',
        status: opts?.filterByStatus || '',
        category_id: opts?.categoryId || '',
        vendor_id: opts?.vendorId || '',
        integration_name: opts?.integrationName || '',
        integration_id: opts?.integrationId || '',
        manufacturer: opts?.manufacturer || '',
        brand: opts?.brand || '',
        ean_contains: opts?.eanContains || '',
        sku_contains: opts?.skuContains || '',
        name_contains: opts?.nameContains || '',
      },
      limit: opts?.limit,
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
  async delete(itemId: string): Promise<DeleteItemResponse> {
    return this.client.delete<DeleteItemResponse>({
      path: ['items', itemId],
    });
  }

  /**
   * Update custom field in existing items.
   */
  async updateCustomField(
    itemId: string,
    customFields: CustomField
  ): Promise<UpdateItemCustomfieldResponse> {
    return this.client.put<UpdateItemCustomfieldResponse>({
      path: ['item', itemId, 'customfields'],
      body: customFields,
    });
  }

  /**
   * Delete an item image.
   */
  async deleteImage(itemId: string): Promise<DeleteItemImageResponse> {
    return this.client.delete<DeleteItemImageResponse>({
      path: ['items', itemId, 'image'],
    });
  }

  /**
   * Mark as active.
   */
  async markActive(itemId: string): Promise<MarkAsActiveResponse> {
    return this.client.post<MarkAsActiveResponse>({
      path: ['items', itemId, 'active'],
    });
  }

  /**
   * Mark as inactive.
   */
  async markInactive(itemId: string): Promise<MarkAsInactiveResponse> {
    return this.client.post<MarkAsInactiveResponse>({
      path: ['items', itemId, 'inactive'],
    });
  }
}
