import type {
  CreateItemGroupRequest,
  CreateItemGroupResponse,
  GetItemGroupResponse,
  ListItemGroupsQuery,
  ListItemGroupsResponse,
  UpdateItemGroupRequest,
  UpdateItemGroupResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class ItemGroups {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListItemGroupsQuery): Promise<ListItemGroupsResponse['itemgroups']> {
    const { itemgroups } = await this.http.get<ListItemGroupsResponse>({
      path: ['itemgroups'],
      query: params,
    })
    return itemgroups
  }

  async create(data: CreateItemGroupRequest): Promise<CreateItemGroupResponse> {
    return this.http.post<CreateItemGroupResponse>({ path: ['itemgroups'], body: data })
  }

  async get(itemgroupId: string): Promise<GetItemGroupResponse> {
    return this.http.get<GetItemGroupResponse>({ path: ['itemgroups', itemgroupId] })
  }

  async update(
    itemgroupId: string,
    data: UpdateItemGroupRequest
  ): Promise<UpdateItemGroupResponse> {
    return this.http.put<UpdateItemGroupResponse>({ path: ['itemgroups', itemgroupId], body: data })
  }

  async delete(itemgroupId: string): Promise<void> {
    await this.http.delete({ path: ['itemgroups', itemgroupId] })
  }

  async markAsActive(itemgroupId: string): Promise<void> {
    await this.http.post({
      path: ['itemgroups', itemgroupId, 'active'],
    })
  }

  async markAsInactive(itemgroupId: string): Promise<void> {
    await this.http.post({
      path: ['itemgroups', itemgroupId, 'inactive'],
    })
  }
}
