import type { ApiClient } from '../client';
import type {
  CreateItemGroupRequest,
  CreateItemGroupResponse,
  DeleteItemGroupResponse,
  ListAllItemGroupsResponse,
  MarkAsActiveResponse,
  MarkAsInactiveResponse,
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
    filterBy?: string;
  }): Promise<ListAllItemGroupsResponse['itemgroups']> {
    return this.client.getList({
      path: ['itemgroups'],
      params: {},
      limit: opts?.limit,
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

  async delete(itemGroupId: string): Promise<DeleteItemGroupResponse> {
    const res = await this.client.delete<DeleteItemGroupResponse>({
      path: ['itemgroups', itemGroupId],
    });

    return res;
  }

  /**
   * Mark an Item Group as active.
   */
  async markAsActive(itemGroupId: string): Promise<MarkAsActiveResponse> {
    const res = await this.client.post<MarkAsActiveResponse>({
      path: ['itemgroups', itemGroupId, 'active'],
    });

    return res;
  }

  /**
   * Mark an Item Group as inactive.
   */
  async markAsInactive(itemGroupId: string): Promise<MarkAsInactiveResponse> {
    const res = await this.client.post<MarkAsInactiveResponse>({
      path: ['itemgroups', itemGroupId, 'inactive'],
    });

    return res;
  }
}
