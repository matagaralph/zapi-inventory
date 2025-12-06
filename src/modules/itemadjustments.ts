import type { ApiClient } from '../client';
import type {
  CreateItemAdjustmentRequest,
  CreateItemAdjustmentResponse,
  DeleteItemAdjustmentResponse,
  ListAllTheItemAdjustmentsResponse,
  RetrieveItemAdjustmentResponse,
  UpdateItemAdjustmentRequest,
  UpdateItemAdjustmentResponse,
} from '../types/itemadjustment';

export class ItemAdjustmentModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Lists all the item adjustments in Zoho Inventory.
   * If opts.limit is provided, return at most that many items.
   */
  async list(
    opts: {
      limit?: number;
    } = {}
  ): Promise<ListAllTheItemAdjustmentsResponse['inventory_adjustments']> {
    return this.client.getList({
      path: ['inventoryadjustments'],
      limit: opts.limit,
      extractor: (res: ListAllTheItemAdjustmentsResponse) =>
        res.inventory_adjustments ?? [],
    });
  }

  /**
   * Create a new item adjustment.
   */
  async create(
    adjustment: CreateItemAdjustmentRequest
  ): Promise<CreateItemAdjustmentResponse['inventory_adjustment']> {
    const res = await this.client.post<CreateItemAdjustmentResponse>({
      path: ['inventoryadjustments'],
      body: adjustment,
    });

    return res.inventory_adjustment;
  }

  /**
   * Retrieve an item adjustment by ID.
   */
  async get(
    inventoryAdjustmentId: string
  ): Promise<RetrieveItemAdjustmentResponse['inventory_adjustment']> {
    const res = await this.client.get<{
      inventory_adjustment: RetrieveItemAdjustmentResponse['inventory_adjustment'];
    }>({
      path: ['inventoryadjustments', inventoryAdjustmentId],
    });

    return res.inventory_adjustment;
  }

  /**
   * Update an existing item adjustment.
   */
  async update(
    inventoryAdjustmentId: string,
    adjustment: UpdateItemAdjustmentRequest
  ): Promise<UpdateItemAdjustmentResponse['inventory_adjustment']> {
    const res = await this.client.put<UpdateItemAdjustmentResponse>({
      path: ['inventoryadjustments', inventoryAdjustmentId],
      body: adjustment,
    });

    return res.inventory_adjustment;
  }

  /**
   * Delete an item adjustment.
   */
  async delete(
    inventoryAdjustmentId: string
  ): Promise<DeleteItemAdjustmentResponse> {
    const res = await this.client.delete<DeleteItemAdjustmentResponse>({
      path: ['inventoryadjustments', inventoryAdjustmentId],
    });

    return res;
  }
}
