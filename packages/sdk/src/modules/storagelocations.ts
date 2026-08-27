import type {
  BulkDeleteStorageLocationsResponse,
  ConfigureItemDefaultStorageLocationRequest,
  ConfigureItemDefaultStorageLocationResponse,
  CreateStorageLocationRequest,
  CreateStorageLocationResponse,
  CreateStorageZoneRequest,
  CreateStorageZoneResponse,
  DeleteStorageLocationResponse,
  DeleteStorageZoneResponse,
  DisableStorageLocationsResponse,
  EnableStorageLocationsResponse,
  GetItemDefaultStorageLocationResponse,
  GetItemStorageLocationMappingsResponse,
  GetStorageLocationResponse,
  GetStorageZoneResponse,
  ListStorageLocationsResponse,
  ListStorageZonesResponse,
  MapStorageLocationsToItemRequest,
  MarkStorageLocationsAsActiveResponse,
  MarkStorageLocationsAsInactiveResponse,
  MarkStorageZonesAsActiveResponse,
  MarkStorageZonesAsInactiveResponse,
  UpdateItemStorageLocationMappingsResponse,
  UpdateStorageLocationRequest,
  UpdateStorageLocationResponse,
  UpdateStorageZoneRequest,
  UpdateStorageZoneResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class StorageLocations {
  constructor(private readonly http: HTTPClient) {}

  async enableForWarehouse(warehouseId: string): Promise<EnableStorageLocationsResponse> {
    return this.http.post<EnableStorageLocationsResponse>({
      path: ['settings', 'warehouses', warehouseId, 'storagelocations', 'enable'],
    })
  }

  async disableForWarehouse(warehouseId: string): Promise<DisableStorageLocationsResponse> {
    return this.http.post<DisableStorageLocationsResponse>({
      path: ['settings', 'warehouses', warehouseId, 'storagelocations', 'disable'],
    })
  }

  async enableForLocation(locationId: string): Promise<EnableStorageLocationsResponse> {
    return this.http.post<EnableStorageLocationsResponse>({
      path: ['locations', locationId, 'storagelocations', 'enable'],
    })
  }

  async disableForLocation(locationId: string): Promise<DisableStorageLocationsResponse> {
    return this.http.post<DisableStorageLocationsResponse>({
      path: ['locations', locationId, 'storagelocations', 'disable'],
    })
  }

  async listZones(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListStorageZonesResponse['storage_zones']> {
    const { storage_zones } = await this.http.get<ListStorageZonesResponse>({
      path: ['storagezones'],
      query: params,
    })
    return storage_zones
  }

  async createZone(
    data: CreateStorageZoneRequest
  ): Promise<CreateStorageZoneResponse['storage_zone']> {
    const { storage_zone } = await this.http.post<CreateStorageZoneResponse>({
      path: ['storagezones'],
      body: data,
    })
    return storage_zone
  }

  async bulkMarkZonesAsActive(storageZoneIds: string): Promise<MarkStorageZonesAsActiveResponse> {
    return this.http.put<MarkStorageZonesAsActiveResponse>({
      path: ['storagezones', 'active'],
      query: { storage_zone_ids: storageZoneIds },
    })
  }

  async bulkMarkZonesAsInactive(
    storageZoneIds: string
  ): Promise<MarkStorageZonesAsInactiveResponse> {
    return this.http.put<MarkStorageZonesAsInactiveResponse>({
      path: ['storagezones', 'inactive'],
      query: { storage_zone_ids: storageZoneIds },
    })
  }

  async getZone(zoneId: string): Promise<GetStorageZoneResponse['storage_zone']> {
    const { storage_zone } = await this.http.get<GetStorageZoneResponse>({
      path: ['storagezones', zoneId],
    })
    return storage_zone
  }

  async updateZone(
    zoneId: string,
    data: UpdateStorageZoneRequest
  ): Promise<UpdateStorageZoneResponse['storage_zone']> {
    const { storage_zone } = await this.http.put<UpdateStorageZoneResponse>({
      path: ['storagezones', zoneId],
      body: data,
    })
    return storage_zone
  }

  async deleteZone(zoneId: string): Promise<void> {
    await this.http.delete<DeleteStorageZoneResponse>({ path: ['storagezones', zoneId] })
  }

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListStorageLocationsResponse['storage_locations']> {
    const { storage_locations } = await this.http.get<ListStorageLocationsResponse>({
      path: ['storagelocations'],
      query: params,
    })
    return storage_locations
  }

  async create(
    data: CreateStorageLocationRequest
  ): Promise<CreateStorageLocationResponse['storage_location']> {
    const { storage_location } = await this.http.post<CreateStorageLocationResponse>({
      path: ['storagelocations'],
      body: data,
    })
    return storage_location
  }

  async bulkDelete(storageIds: string): Promise<BulkDeleteStorageLocationsResponse> {
    return this.http.delete<BulkDeleteStorageLocationsResponse>({
      path: ['storagelocations'],
      query: { storage_ids: storageIds },
    })
  }

  async bulkMarkAsActive(storageIds: string): Promise<MarkStorageLocationsAsActiveResponse> {
    return this.http.post<MarkStorageLocationsAsActiveResponse>({
      path: ['storagelocations', 'active'],
      query: { storage_ids: storageIds },
    })
  }

  async bulkMarkAsInactive(storageIds: string): Promise<MarkStorageLocationsAsInactiveResponse> {
    return this.http.post<MarkStorageLocationsAsInactiveResponse>({
      path: ['storagelocations', 'inactive'],
      query: { storage_ids: storageIds },
    })
  }

  async get(storageId: string): Promise<GetStorageLocationResponse['storage_location']> {
    const { storage_location } = await this.http.get<GetStorageLocationResponse>({
      path: ['storagelocations', storageId],
    })
    return storage_location
  }

  async update(
    storageId: string,
    data: UpdateStorageLocationRequest
  ): Promise<UpdateStorageLocationResponse['storage_location']> {
    const { storage_location } = await this.http.put<UpdateStorageLocationResponse>({
      path: ['storagelocations', storageId],
      body: data,
    })
    return storage_location
  }

  async delete(storageId: string): Promise<void> {
    await this.http.delete<DeleteStorageLocationResponse>({ path: ['storagelocations', storageId] })
  }

  async getItemMappings(
    itemId: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<GetItemStorageLocationMappingsResponse['storage_locations_product_mapping']> {
    const { storage_locations_product_mapping } =
      await this.http.get<GetItemStorageLocationMappingsResponse>({
        path: ['items', itemId, 'storagelocationsmapping'],
        query: params,
      })
    return storage_locations_product_mapping
  }

  async updateItemMappings(
    itemId: string,
    data: MapStorageLocationsToItemRequest
  ): Promise<UpdateItemStorageLocationMappingsResponse> {
    return this.http.put<UpdateItemStorageLocationMappingsResponse>({
      path: ['items', itemId, 'storagelocationsmapping'],
      body: data,
    })
  }

  async getItemDefault(
    itemId: string
  ): Promise<GetItemDefaultStorageLocationResponse['default_storage_location_mapping']> {
    const { default_storage_location_mapping } =
      await this.http.get<GetItemDefaultStorageLocationResponse>({
        path: ['items', itemId, 'defaultstoragemapping'],
      })
    return default_storage_location_mapping
  }

  async configureItemDefault(
    itemId: string,
    data: ConfigureItemDefaultStorageLocationRequest
  ): Promise<ConfigureItemDefaultStorageLocationResponse> {
    return this.http.put<ConfigureItemDefaultStorageLocationResponse>({
      path: ['items', itemId, 'configure', 'defaultstorage'],
      body: data,
    })
  }

  async getCompositeItemDefault(
    itemId: string
  ): Promise<GetItemDefaultStorageLocationResponse['default_storage_location_mapping']> {
    const { default_storage_location_mapping } =
      await this.http.get<GetItemDefaultStorageLocationResponse>({
        path: ['compositeitems', itemId, 'defaultstoragemapping'],
      })
    return default_storage_location_mapping
  }

  async configureCompositeItemDefault(
    itemId: string,
    data: ConfigureItemDefaultStorageLocationRequest
  ): Promise<ConfigureItemDefaultStorageLocationResponse> {
    return this.http.put<ConfigureItemDefaultStorageLocationResponse>({
      path: ['compositeitems', itemId, 'configure', 'defaultstorage'],
      body: data,
    })
  }
}
