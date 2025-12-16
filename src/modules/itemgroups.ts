import type { ApiClient } from '../client';
import type {
  CreateItemGroupRequest,
  CreateItemGroupResponse,
  ListAllItemGroupsResponse,
  RetrieveItemGroupResponse,
  UpdateItemGroupRequest,
  UpdateItemGroupResponse,
} from '../types/itemgroup';

export class ItemGroupModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * List all Item Groups.
   */
  async list(opts?: {
    limit?: number;
    filter_by?: string;
  }): Promise<ListAllItemGroupsResponse['itemgroups']> {
    const { limit, ...params } = opts ?? {};
    return this.client.getList({
      path: ['itemgroups'],
      params,
      limit: limit,
      extractor: (res: ListAllItemGroupsResponse) => res.itemgroups ?? [],
    });
  }

  /**
   * Create an Item Group.
   */
  async create(
    itemGroup: CreateItemGroupRequest
  ): Promise<CreateItemGroupResponse> {
    const res = await this.client.post<CreateItemGroupResponse>({
      path: ['itemgroups'],
      body: itemGroup,
    });

    return res;
  }

  /**
   * Retrieve an Item Group.
   */
  async get(itemGroupId: string): Promise<RetrieveItemGroupResponse> {
    const res = await this.client.get<RetrieveItemGroupResponse>({
      path: ['itemgroups', itemGroupId],
    });

    return res;
  }

  /**
   * Update an Item Group.
   */
  async update(
    itemGroupId: string,
    itemGroup: UpdateItemGroupRequest
  ): Promise<UpdateItemGroupResponse> {
    const res = await this.client.put<UpdateItemGroupResponse>({
      path: ['itemgroups', itemGroupId],
      body: itemGroup,
    });

    return res;
  }

  delete(itemGroupId: string): Promise<void> {
    return this.client.delete({
      path: ['itemgroups', itemGroupId],
    });
  }

  /**
   * Mark an Item Group as active.
   */
  markAsActive(itemGroupId: string): Promise<void> {
    return this.client.post({
      path: ['itemgroups', itemGroupId, 'active'],
    });
  }

  /**
   * Mark an Item Group as inactive.
   */
  markAsInactive(itemGroupId: string): Promise<void> {
    return this.client.post({
      path: ['itemgroups', itemGroupId, 'inactive'],
    });
  }
}
