import type {
  ConfigureItemDefaultStorageLocationRequest,
  CreateStorageLocationRequest,
  CreateStorageLocationResponse,
  CreateStorageZoneRequest,
  CreateStorageZoneResponse,
  GetItemDefaultStorageLocationResponse,
  GetItemStorageLocationMappingsResponse,
  GetStorageLocationResponse,
  GetStorageZoneResponse,
  ListStorageLocationsResponse,
  ListStorageLocationsQuery,
  ListStorageZonesResponse,
  ListStorageZonesQuery,
  MapStorageLocationsToItemRequest,
  MarkStorageLocationsAsActiveQuery,
  MarkStorageLocationsAsInactiveQuery,
  MarkStorageZonesAsActiveQuery,
  MarkStorageZonesAsInactiveQuery,
  BulkDeleteStorageLocationsQuery,
  GetItemStorageLocationMappingsQuery,
  UpdateStorageLocationRequest,
  UpdateStorageLocationResponse,
  UpdateStorageZoneRequest,
  UpdateStorageZoneResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * Bin locations are the smallest storage units within a warehouse. They help optimize operations with effective tracking and labeling, make items easier to locate, and support multiple storage levels for precise inventory tracking.
 */
export function createStorageLocations(http: HTTPClient) {
  return {
    async enableForWarehouse(warehouseId: string): Promise<void> {
      await http.post({
        path: ['settings', 'warehouses', warehouseId, 'storagelocations', 'enable'],
      })
    },

    async disableForWarehouse(warehouseId: string): Promise<void> {
      await http.post({
        path: ['settings', 'warehouses', warehouseId, 'storagelocations', 'disable'],
      })
    },

    async enableForLocation(locationId: string): Promise<void> {
      await http.post({
        path: ['locations', locationId, 'storagelocations', 'enable'],
      })
    },

    async disableForLocation(locationId: string): Promise<void> {
      await http.post({
        path: ['locations', locationId, 'storagelocations', 'disable'],
      })
    },

    async listZones(
      params?: ListStorageZonesQuery
    ): Promise<ListStorageZonesResponse['storage_zones']> {
      const { storage_zones } = await http.get<ListStorageZonesResponse>({
        path: ['storagezones'],
        query: params,
      })
      return storage_zones
    },

    async createZone(
      data: CreateStorageZoneRequest
    ): Promise<CreateStorageZoneResponse['storage_zone']> {
      const { storage_zone } = await http.post<CreateStorageZoneResponse>({
        path: ['storagezones'],
        body: data,
      })
      return storage_zone
    },

    async bulkMarkZonesAsActive(params: MarkStorageZonesAsActiveQuery): Promise<void> {
      await http.put({
        path: ['storagezones', 'active'],
        query: params,
      })
    },

    async bulkMarkZonesAsInactive(params: MarkStorageZonesAsInactiveQuery): Promise<void> {
      await http.put({
        path: ['storagezones', 'inactive'],
        query: params,
      })
    },

    async getZone(zoneId: string): Promise<GetStorageZoneResponse['storage_zone']> {
      const { storage_zone } = await http.get<GetStorageZoneResponse>({
        path: ['storagezones', zoneId],
      })
      return storage_zone
    },

    async updateZone(
      zoneId: string,
      data: UpdateStorageZoneRequest
    ): Promise<UpdateStorageZoneResponse['storage_zone']> {
      const { storage_zone } = await http.put<UpdateStorageZoneResponse>({
        path: ['storagezones', zoneId],
        body: data,
      })
      return storage_zone
    },

    async deleteZone(zoneId: string): Promise<void> {
      await http.delete({ path: ['storagezones', zoneId] })
    },

    async list(
      params?: ListStorageLocationsQuery
    ): Promise<ListStorageLocationsResponse['storage_locations']> {
      const { storage_locations } = await http.get<ListStorageLocationsResponse>({
        path: ['storagelocations'],
        query: params,
      })
      return storage_locations
    },

    async create(
      data: CreateStorageLocationRequest
    ): Promise<CreateStorageLocationResponse['storage_location']> {
      const { storage_location } = await http.post<CreateStorageLocationResponse>({
        path: ['storagelocations'],
        body: data,
      })
      return storage_location
    },

    async bulkDelete(params: BulkDeleteStorageLocationsQuery): Promise<void> {
      await http.delete({
        path: ['storagelocations'],
        query: params,
      })
    },

    async bulkMarkAsActive(params: MarkStorageLocationsAsActiveQuery): Promise<void> {
      await http.post({
        path: ['storagelocations', 'active'],
        query: params,
      })
    },

    async bulkMarkAsInactive(params: MarkStorageLocationsAsInactiveQuery): Promise<void> {
      await http.post({
        path: ['storagelocations', 'inactive'],
        query: params,
      })
    },

    async get(storageId: string): Promise<GetStorageLocationResponse['storage_location']> {
      const { storage_location } = await http.get<GetStorageLocationResponse>({
        path: ['storagelocations', storageId],
      })
      return storage_location
    },

    async update(
      storageId: string,
      data: UpdateStorageLocationRequest
    ): Promise<UpdateStorageLocationResponse['storage_location']> {
      const { storage_location } = await http.put<UpdateStorageLocationResponse>({
        path: ['storagelocations', storageId],
        body: data,
      })
      return storage_location
    },

    async delete(storageId: string): Promise<void> {
      await http.delete({ path: ['storagelocations', storageId] })
    },

    async getItemMappings(
      itemId: string,
      params?: GetItemStorageLocationMappingsQuery
    ): Promise<GetItemStorageLocationMappingsResponse['storage_locations_product_mapping']> {
      const { storage_locations_product_mapping } =
        await http.get<GetItemStorageLocationMappingsResponse>({
          path: ['items', itemId, 'storagelocationsmapping'],
          query: params,
        })
      return storage_locations_product_mapping
    },

    async updateItemMappings(
      itemId: string,
      data: MapStorageLocationsToItemRequest
    ): Promise<void> {
      await http.put({
        path: ['items', itemId, 'storagelocationsmapping'],
        body: data,
      })
    },

    async getItemDefault(
      itemId: string
    ): Promise<GetItemDefaultStorageLocationResponse['default_storage_location_mapping']> {
      const { default_storage_location_mapping } =
        await http.get<GetItemDefaultStorageLocationResponse>({
          path: ['items', itemId, 'defaultstoragemapping'],
        })
      return default_storage_location_mapping
    },

    async configureItemDefault(
      itemId: string,
      data: ConfigureItemDefaultStorageLocationRequest
    ): Promise<void> {
      await http.put({
        path: ['items', itemId, 'configure', 'defaultstorage'],
        body: data,
      })
    },

    async getCompositeItemDefault(
      itemId: string
    ): Promise<GetItemDefaultStorageLocationResponse['default_storage_location_mapping']> {
      const { default_storage_location_mapping } =
        await http.get<GetItemDefaultStorageLocationResponse>({
          path: ['compositeitems', itemId, 'defaultstoragemapping'],
        })
      return default_storage_location_mapping
    },

    async configureCompositeItemDefault(
      itemId: string,
      data: ConfigureItemDefaultStorageLocationRequest
    ): Promise<void> {
      await http.put({
        path: ['compositeitems', itemId, 'configure', 'defaultstorage'],
        body: data,
      })
    },
  }
}

export type StorageLocations = ReturnType<typeof createStorageLocations>
