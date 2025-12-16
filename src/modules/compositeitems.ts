import type { ApiClient } from '../client';
import type {
  BundlingHistoryResponse,
  CreateBundleRequest,
  CreateBundleResponse,
  CreatingCompositeItemRequest,
  CreatingCompositeItemResponse,
  ListAllCompositeItemsResponse,
  RetrieveBundleResponse,
  RetrievingCompositeItemResponse,
  UpdatingCompositeItemRequest,
  UpdatingCompositeItemResponse,
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
  delete(compositeItemId: string): Promise<void> {
    return this.client.delete({
      path: ['compositeitems', compositeItemId],
    });
  }

  /**
   * Mark Composite Item as Active.
   */
  markActive(compositeItemId: string): Promise<void> {
    return this.client.post({
      path: ['compositeitems', compositeItemId, 'active'],
    });
  }

  /**
   * Mark Composite Item as Inactive.
   */
  markInactive(compositeItemId: string): Promise<void> {
    return this.client.post({
      path: ['compositeitems', compositeItemId, 'inactive'],
    });
  }

  /**
   * List Assemblies (Bundling History).
   * Filterable by composite_item_id.
   */
  async listBundles(opts?: {
    composite_item_id?: string;
    limit?: number;
  }): Promise<BundlingHistoryResponse['bundles']> {
    const { limit, ...params } = opts ?? {};
    return this.client.getList({
      path: ['bundles'],
      params,
      limit,
      extractor: (res: BundlingHistoryResponse) => res.bundles ?? [],
    });
  }

  /**
   * Create Assembly (Bundle).
   */
  async createBundle(
    bundle: CreateBundleRequest
  ): Promise<CreateBundleResponse> {
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
  deleteBundle(bundleId: string): Promise<void> {
    return this.client.delete({
      path: ['bundles', bundleId],
    });
  }
}
