import type {
  CreateLocationRequest,
  CreateLocationResponse,
  GetLocationResponse,
  ListLocationsQuery,
  ListLocationResponse,
  ListUsersOfLocationQuery,
  ListUsersOfLocationResponse,
  UpdateLocationRequest,
  UpdateLocationResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * Create locations for each branch and warehouse in your organisation and manage them all in one place.
 * In this document, you can learn how to create and manage locations in Zoho Inventory.
 */
export function createLocations(http: HTTPClient) {
  return {
    async enable(): Promise<void> {
      await http.post({ path: ['settings', 'locations', 'enable'] })
    },

    async list(params?: ListLocationsQuery): Promise<ListLocationResponse['locations']> {
      const { locations } = await http.get<ListLocationResponse>({
        path: ['locations'],
        query: { ...params },
      })
      return locations
    },

    async create(data: CreateLocationRequest): Promise<CreateLocationResponse['locations']> {
      const { locations } = await http.post<CreateLocationResponse>({
        path: ['locations'],
        body: data,
      })
      return locations
    },

    async get(locationId: string): Promise<GetLocationResponse['location']> {
      const { location } = await http.get<GetLocationResponse>({
        path: ['locations', locationId],
      })
      return location
    },

    async update(
      locationId: string,
      data: UpdateLocationRequest
    ): Promise<UpdateLocationResponse['locations']> {
      const { locations } = await http.put<UpdateLocationResponse>({
        path: ['locations', locationId],
        body: data,
      })
      return locations
    },

    async delete(locationId: string): Promise<void> {
      await http.delete({ path: ['locations', locationId] })
    },

    async markAsActive(locationId: string): Promise<void> {
      await http.post({
        path: ['locations', locationId, 'active'],
      })
    },

    async markAsInactive(locationId: string): Promise<void> {
      await http.post({
        path: ['locations', locationId, 'inactive'],
      })
    },

    async markAsPrimary(locationId: string): Promise<void> {
      await http.post({
        path: ['locations', locationId, 'markasprimary'],
      })
    },

    async listUsers(
      locationId: string,
      params?: ListUsersOfLocationQuery
    ): Promise<ListUsersOfLocationResponse['users']> {
      const { users } = await http.get<ListUsersOfLocationResponse>({
        path: ['locations', locationId, 'users'],
        query: { ...params },
      })
      return users
    },
  }
}

export type Locations = ReturnType<typeof createLocations>
