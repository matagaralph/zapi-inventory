import type {
  ApproveInventoryCountRequest,
  AutocompleteInventoryCountItemsQuery,
  AutocompleteInventoryCountStoragesQuery,
  AutocompleteItemsResponse,
  AutocompleteStoragesResponse,
  BulkDeleteInventoryCountsQuery,
  CreateInventoryCountQuery,
  CreateInventoryCountRequest,
  CreateRecurringInventoryCountQuery,
  CreateRecurringInventoryCountRequest,
  GetInventoryCountResponse,
  GetRecurringInventoryCountResponse,
  InventoryCountingPreferencesRequest,
  InventoryCountingPreferencesResponse,
  InventoryCountResponse,
  InventoryCountSettingsRequest,
  InventoryCountSettingsResponse,
  InventorycountingPageContext,
  ListInventoryCountItemStoragesQuery,
  ListInventoryCountItemTrackingDetailsQuery,
  ListInventoryCountsQuery,
  ListInventoryCountsResponse,
  ListItemStoragesResponse,
  ListRecurringInventoryCountsQuery,
  RecurringInventoryCountResponse,
  RecurringinventorycountObject,
  SubmitInventoryCountQuery,
  UpdateCountedQuantitiesQuery,
  UpdateCountedQuantitiesRequest,
  UpdateInventoryCountQuery,
  UpdateInventoryCountRequest,
  UpdateRecurringInventoryCountQuery,
  UpdateRecurringInventoryCountRequest,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

interface InventoryCountActionResponse {
  code?: number
  message?: string
}

interface ListRecurringInventoryCountsResponse {
  code?: number
  message?: string
  recurringinventorycounts?: RecurringinventorycountObject[]
  page_context?: InventorycountingPageContext
}

interface InventoryCountItemTrackingDetailsResponse {
  code?: number
  message?: string
  serial_numbers?: {
    serialnumber?: string
    found?: boolean
    is_new?: boolean
  }[]
  batches?: {
    batch_number?: string
    counted_quantity?: number
    system_quantity?: number
    stock_variance?: number
    is_new?: boolean
  }[]
  page_context?: InventorycountingPageContext
}

export class InventoryCounts {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: ListInventoryCountsQuery
  ): Promise<ListInventoryCountsResponse['inventorycounts']> {
    const { inventorycounts } = await this.http.get<ListInventoryCountsResponse>({
      path: ['inventorycounts'],
      query: params,
    })
    return inventorycounts
  }

  async create(
    data: CreateInventoryCountRequest,
    params?: CreateInventoryCountQuery
  ): Promise<InventoryCountResponse['inventorycount']> {
    const { inventorycount } = await this.http.post<InventoryCountResponse>({
      path: ['inventorycounts'],
      body: data,
      query: params,
    })
    return inventorycount
  }

  async bulkDelete(params: BulkDeleteInventoryCountsQuery): Promise<void> {
    await this.http.delete({
      path: ['inventorycounts'],
      query: params,
    })
  }

  async get(inventorycountId: string): Promise<GetInventoryCountResponse> {
    return this.http.get<GetInventoryCountResponse>({
      path: ['inventorycounts', inventorycountId],
    })
  }

  async update(
    inventorycountId: string,
    data: UpdateInventoryCountRequest,
    params?: UpdateInventoryCountQuery
  ): Promise<InventoryCountResponse['inventorycount']> {
    const { inventorycount } = await this.http.put<InventoryCountResponse>({
      path: ['inventorycounts', inventorycountId],
      body: data,
      query: params,
    })
    return inventorycount
  }

  async delete(inventorycountId: string): Promise<void> {
    await this.http.delete({ path: ['inventorycounts', inventorycountId] })
  }

  async start(inventorycountId: string): Promise<InventoryCountResponse['inventorycount']> {
    const { inventorycount } = await this.http.post<InventoryCountResponse>({
      path: ['inventorycounts', inventorycountId, 'start'],
    })
    return inventorycount
  }

  async updateCountedQuantities(
    inventorycountId: string,
    data: UpdateCountedQuantitiesRequest,
    params?: UpdateCountedQuantitiesQuery
  ): Promise<InventoryCountResponse['inventorycount']> {
    const { inventorycount } = await this.http.put<InventoryCountResponse>({
      path: ['inventorycounts', inventorycountId, 'count'],
      body: data,
      query: params,
    })
    return inventorycount
  }

  async submit(
    inventorycountId: string,
    params?: SubmitInventoryCountQuery
  ): Promise<InventoryCountResponse['inventorycount']> {
    const { inventorycount } = await this.http.post<InventoryCountResponse>({
      path: ['inventorycounts', inventorycountId, 'submit'],
      query: params,
    })
    return inventorycount
  }

  async approve(
    inventorycountId: string,
    data: ApproveInventoryCountRequest
  ): Promise<InventoryCountResponse['inventorycount']> {
    const { inventorycount } = await this.http.put<InventoryCountResponse>({
      path: ['inventorycounts', inventorycountId, 'approve'],
      body: data,
    })
    return inventorycount
  }

  async cancel(inventorycountId: string): Promise<InventoryCountActionResponse> {
    return this.http.post<InventoryCountActionResponse>({
      path: ['inventorycounts', inventorycountId, 'cancel'],
    })
  }

  async listRecurring(
    params?: ListRecurringInventoryCountsQuery
  ): Promise<RecurringinventorycountObject[] | undefined> {
    const { recurringinventorycounts } = await this.http.get<ListRecurringInventoryCountsResponse>({
      path: ['recurringinventorycounts'],
      query: params,
    })
    return recurringinventorycounts
  }

  async createRecurring(
    data: CreateRecurringInventoryCountRequest,
    params?: CreateRecurringInventoryCountQuery
  ): Promise<RecurringInventoryCountResponse['recurringinventorycount']> {
    const { recurringinventorycount } = await this.http.post<RecurringInventoryCountResponse>({
      path: ['recurringinventorycounts'],
      body: data,
      query: params,
    })
    return recurringinventorycount
  }

  async activateRecurring(
    recurringinventorycountId: string
  ): Promise<InventoryCountActionResponse> {
    return this.http.post<InventoryCountActionResponse>({
      path: ['recurringinventorycounts', recurringinventorycountId, 'active'],
    })
  }

  async deactivateRecurring(
    recurringinventorycountId: string
  ): Promise<InventoryCountActionResponse> {
    return this.http.post<InventoryCountActionResponse>({
      path: ['recurringinventorycounts', recurringinventorycountId, 'inactive'],
    })
  }

  async getRecurring(
    recurringinventorycountId: string
  ): Promise<GetRecurringInventoryCountResponse> {
    return this.http.get<GetRecurringInventoryCountResponse>({
      path: ['recurringinventorycounts', recurringinventorycountId],
    })
  }

  async updateRecurring(
    recurringinventorycountId: string,
    data: UpdateRecurringInventoryCountRequest,
    params?: UpdateRecurringInventoryCountQuery
  ): Promise<RecurringInventoryCountResponse['recurringinventorycount']> {
    const { recurringinventorycount } = await this.http.put<RecurringInventoryCountResponse>({
      path: ['recurringinventorycounts', recurringinventorycountId],
      body: data,
      query: params,
    })
    return recurringinventorycount
  }

  async deleteRecurring(recurringinventorycountId: string): Promise<void> {
    await this.http.delete({ path: ['recurringinventorycounts', recurringinventorycountId] })
  }

  async listItemTrackingDetails(
    inventorycountItemId: string,
    params?: ListInventoryCountItemTrackingDetailsQuery
  ): Promise<Pick<InventoryCountItemTrackingDetailsResponse, 'serial_numbers' | 'batches'>> {
    const { serial_numbers, batches } =
      await this.http.get<InventoryCountItemTrackingDetailsResponse>({
        path: ['inventorycountitems', inventorycountItemId, 'trackingdetails'],
        query: params,
      })
    return { serial_numbers, batches }
  }

  async listItemStorages(
    inventorycountId: string,
    itemId: string,
    params?: ListInventoryCountItemStoragesQuery
  ): Promise<ListItemStoragesResponse['storages']> {
    const { storages } = await this.http.get<ListItemStoragesResponse>({
      path: ['inventorycounts', inventorycountId, 'items', itemId, 'storages'],
      query: params,
    })
    return storages
  }

  async autocompleteItems(
    params?: AutocompleteInventoryCountItemsQuery
  ): Promise<AutocompleteItemsResponse['inventorycount_items']> {
    const { inventorycount_items } = await this.http.get<AutocompleteItemsResponse>({
      path: ['autocomplete', 'inventorycounts', 'items'],
      query: params,
    })
    return inventorycount_items
  }

  async autocompleteStorages(
    params?: AutocompleteInventoryCountStoragesQuery
  ): Promise<AutocompleteStoragesResponse['storage_locations']> {
    const { storage_locations } = await this.http.get<AutocompleteStoragesResponse>({
      path: ['autocomplete', 'inventorycounts', 'storages'],
      query: params,
    })
    return storage_locations
  }

  async updateSettings(
    data: InventoryCountSettingsRequest
  ): Promise<InventoryCountSettingsResponse['settings']> {
    const { settings } = await this.http.put<InventoryCountSettingsResponse>({
      path: ['settings', 'inventorycounts'],
      body: data,
    })
    return settings
  }

  async updatePreferences(
    data: InventoryCountingPreferencesRequest
  ): Promise<InventoryCountingPreferencesResponse['preferences']> {
    const { preferences } = await this.http.put<InventoryCountingPreferencesResponse>({
      path: ['settings', 'preferences', 'inventorycounts'],
      body: data,
    })
    return preferences
  }
}
