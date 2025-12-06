import type { ApiClient } from '../client';
import type {
  ListAllCompositeItemsResponse,
  CreatingCompositeItemRequest,
  CreatingCompositeItemResponse,
  RetrievingCompositeItemResponse,
  UpdatingCompositeItemRequest,
  UpdatingCompositeItemResponse,
  DeletingCompositeItemResponse,
  MarkAsActiveResponse,
  MarkAsInactiveResponse,
  BundlingHistoryResponse,
  CreateBundleRequest,
  CreateBundleResponse,
  RetrieveBundleResponse,
  DeleteBundleResponse,
} from '../types/compositeitem';

export class CompositeItemModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * List All Composite Items.
   */
  async list(opts?: {
    limit?: number;
  }): Promise<ListAllCompositeItemsResponse['composite_items']> {
    return this.client.getList({
      path: ['compositeitems'],
      limit: opts?.limit,
      extractor: (res: ListAllCompositeItemsResponse) =>
        res.composite_items ?? [],
    });
  }

  /**
   * Create a Composite Item.
   */
  async create(
    item: CreatingCompositeItemRequest
  ): Promise<CreatingCompositeItemResponse['composite_item']> {
    const res = await this.client.post<CreatingCompositeItemResponse>({
      path: ['compositeitems'],
      body: item,
    });
    return res.composite_item;
  }

  /**
   * Retrieve a Composite Item.
   */
  async get(compositeItemId: string): Promise<RetrievingCompositeItemResponse> {
    return this.client.get<RetrievingCompositeItemResponse>({
      path: ['compositeitems', compositeItemId],
    });
  }

  /**
   * Update a Composite Item.
   */
  async update(
    compositeItemId: string,
    item: UpdatingCompositeItemRequest
  ): Promise<UpdatingCompositeItemResponse['composite_item']> {
    const res = await this.client.put<UpdatingCompositeItemResponse>({
      path: ['compositeitems', compositeItemId],
      body: item,
    });
    return res.composite_item;
  }

  /**
   * Delete a Composite Item.
   */
  async delete(
    compositeItemId: string
  ): Promise<DeletingCompositeItemResponse> {
    return this.client.delete<DeletingCompositeItemResponse>({
      path: ['compositeitems', compositeItemId],
    });
  }

  /**
   * Mark Composite Item as Active.
   */
  async markActive(compositeItemId: string): Promise<MarkAsActiveResponse> {
    return this.client.post<MarkAsActiveResponse>({
      path: ['compositeitems', compositeItemId, 'active'],
    });
  }

  /**
   * Mark Composite Item as Inactive.
   */
  async markInactive(compositeItemId: string): Promise<MarkAsInactiveResponse> {
    return this.client.post<MarkAsInactiveResponse>({
      path: ['compositeitems', compositeItemId, 'inactive'],
    });
  }

  /**
   * List Assemblies (Bundling History).
   * Filterable by composite_item_id.
   */
  async listBundles(opts?: {
    compositeItemId?: string;
    limit?: number;
  }): Promise<BundlingHistoryResponse['bundles']> {
    const params: Record<string, any> = {};
    if (opts?.compositeItemId) params.composite_item_id = opts.compositeItemId;
    return this.client.getList({
      path: ['bundles'],
      params,
      limit: opts?.limit,
      extractor: (res: BundlingHistoryResponse) => res.bundles ?? [],
    });
  }

  /**
   * Create Assembly (Bundle).
   */
  async createBundle(
    bundle: CreateBundleRequest
  ): Promise<CreateBundleResponse> {
    // The create bundle response is flattened (properties at root) per the schema
    return this.client.post<CreateBundleResponse>({
      path: ['bundles'],
      body: bundle,
    });
  }

  /**
   * Retrieve Assembly (Bundle).
   */
  async getBundle(bundleId: string): Promise<RetrieveBundleResponse['bundle']> {
    const res = await this.client.get<RetrieveBundleResponse>({
      path: ['bundles', bundleId],
    });
    return res.bundle;
  }

  /**
   * Delete Assembly (Bundle).
   */
  async deleteBundle(bundleId: string): Promise<DeleteBundleResponse> {
    return this.client.delete<DeleteBundleResponse>({
      path: ['bundles', bundleId],
    });
  }
}
