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

/**
 * Item Group are the products that you sell or services that you render to various clients and can be purchased from various vendors in a business. Create and manage the item groups your business deals with and also create price lists for specific item and clients.
 */
export function createItemGroups(http: HTTPClient) {
  return {
    async list(params?: ListItemGroupsQuery): Promise<ListItemGroupsResponse['itemgroups']> {
      const { itemgroups } = await http.get<ListItemGroupsResponse>({
        path: ['itemgroups'],
        query: params,
      })
      return itemgroups
    },

    async create(data: CreateItemGroupRequest): Promise<CreateItemGroupResponse> {
      return http.post<CreateItemGroupResponse>({ path: ['itemgroups'], body: data })
    },

    async get(itemgroupId: string): Promise<GetItemGroupResponse> {
      return http.get<GetItemGroupResponse>({ path: ['itemgroups', itemgroupId] })
    },

    async update(
      itemgroupId: string,
      data: UpdateItemGroupRequest
    ): Promise<UpdateItemGroupResponse> {
      return http.put<UpdateItemGroupResponse>({ path: ['itemgroups', itemgroupId], body: data })
    },

    async delete(itemgroupId: string): Promise<void> {
      await http.delete({ path: ['itemgroups', itemgroupId] })
    },

    async markAsActive(itemgroupId: string): Promise<void> {
      await http.post({
        path: ['itemgroups', itemgroupId, 'active'],
      })
    },

    async markAsInactive(itemgroupId: string): Promise<void> {
      await http.post({
        path: ['itemgroups', itemgroupId, 'inactive'],
      })
    },
  }
}

export type ItemGroups = ReturnType<typeof createItemGroups>
