import type {
  BulkDeleteItemsResponse,
  BulkFetchItemDetailsResponse,
  BulkUpdateItemLocationPermissionsQuery,
  BulkMarkItemsActiveResponse,
  BulkMarkItemsInactiveResponse,
  BulkUpdateItemLocationPermissionsResponse,
  CreateItemRequest,
  CreateItemResponse,
  DeleteItemBackImageResponse,
  DeleteItemImageResponse,
  DeleteItemImagesResponse,
  DeleteItemResponse,
  DisableStorageLocationResponse,
  EnableStorageLocationResponse,
  GetItemResponse,
  GetVariantOpeningStockResponse,
  GroupItemsRequest,
  GroupItemsResponse,
  ItemsMarkAsActiveResponse,
  ItemsMarkAsInactiveResponse,
  ListItemDeliveryChallansResponse,
  ListItemDeliveryChallansQuery,
  ListItemInvoicesResponse,
  ListItemInvoicesQuery,
  ListItemMoveOrdersResponse,
  ListItemMoveOrdersQuery,
  ListItemPurchaseOrdersResponse,
  ListItemPurchaseOrdersQuery,
  ListItemPutawaysResponse,
  ListItemPutawaysQuery,
  ListItemsResponse,
  ListItemsQuery,
  ListItemSalesOrdersResponse,
  ListItemSalesOrdersQuery,
  ListItemSalesReceiptsResponse,
  ListItemSalesReceiptsQuery,
  MarkImageAsBackImageResponse,
  MoveItemRequest,
  MoveItemResponse,
  ReorderItemImagesRequest,
  ReorderItemImagesResponse,
  UngroupItemsResponse,
  UpdateItemCustomfieldResponse,
  UpdateItemLocationPermissionsResponse,
  UpdateItemRequest,
  UpdateItemResponse,
  UpdateVariantOpeningStockRequest,
  UpdateVariantOpeningStockResponse,
  UploadItemBackImageResponse,
  UploadItemImageResponse,
  UploadItemImagesResponse,
  UploadItemImagesQuery,
  ValidateAndMapSerialNumbersRequest,
  ValidateAndMapSerialNumbersResponse,
  ValidateSerialNumbersResponse,
  ValidateSerialNumbersQuery,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Items {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListItemsQuery): Promise<ListItemsResponse['items']> {
    const { items } = await this.http.get<ListItemsResponse>({ path: ['items'], query: params })
    return items
  }

  async create(data: CreateItemRequest): Promise<CreateItemResponse['item']> {
    const { item } = await this.http.post<CreateItemResponse>({ path: ['items'], body: data })
    return item
  }

  async bulkDelete(itemIds?: string): Promise<BulkDeleteItemsResponse> {
    return this.http.delete<BulkDeleteItemsResponse>({
      path: ['items'],
      query: { item_ids: itemIds },
    })
  }

  async listDetails(itemIds: string): Promise<BulkFetchItemDetailsResponse['items']> {
    const { items } = await this.http.get<BulkFetchItemDetailsResponse>({
      path: ['itemdetails'],
      query: { item_ids: itemIds },
    })
    return items
  }

  async get(itemId: string): Promise<GetItemResponse['item']> {
    const { item } = await this.http.get<GetItemResponse>({ path: ['items', itemId] })
    return item
  }

  async update(itemId: string, data: UpdateItemRequest): Promise<UpdateItemResponse['item']> {
    const { item } = await this.http.put<UpdateItemResponse>({
      path: ['items', itemId],
      body: data,
    })
    return item
  }

  async delete(itemId: string): Promise<void> {
    await this.http.delete<DeleteItemResponse>({ path: ['items', itemId] })
  }

  async updateCustomField(itemId: string, data: unknown): Promise<UpdateItemCustomfieldResponse> {
    return this.http.put<UpdateItemCustomfieldResponse>({
      path: ['item', itemId, 'customfields'],
      body: data,
    })
  }

  async getImage(itemId: string, preview?: boolean): Promise<unknown> {
    return this.http.get<unknown>({
      path: ['items', itemId, 'image'],
      query: { preview },
    })
  }

  async uploadImage(itemId: string, data: unknown): Promise<UploadItemImageResponse> {
    return this.http.post<UploadItemImageResponse>({
      path: ['items', itemId, 'image'],
      body: data,
    })
  }

  async deleteImage(itemId: string): Promise<DeleteItemImageResponse> {
    return this.http.delete<DeleteItemImageResponse>({ path: ['items', itemId, 'image'] })
  }

  async markAsActive(itemId: string): Promise<ItemsMarkAsActiveResponse> {
    return this.http.post<ItemsMarkAsActiveResponse>({ path: ['items', itemId, 'active'] })
  }

  async markAsInactive(itemId: string): Promise<ItemsMarkAsInactiveResponse> {
    return this.http.post<ItemsMarkAsInactiveResponse>({ path: ['items', itemId, 'inactive'] })
  }

  async getVariantOpeningStock(
    variantId: string
  ): Promise<GetVariantOpeningStockResponse['opening_stock']> {
    const { opening_stock } = await this.http.get<GetVariantOpeningStockResponse>({
      path: ['variants', variantId, 'openingstock'],
    })
    return opening_stock
  }

  async updateVariantOpeningStock(
    variantId: string,
    data: UpdateVariantOpeningStockRequest
  ): Promise<UpdateVariantOpeningStockResponse> {
    return this.http.put<UpdateVariantOpeningStockResponse>({
      path: ['variants', variantId, 'openingstock'],
      body: data,
    })
  }

  async uploadImages(
    itemId: string,
    data: unknown,
    params?: UploadItemImagesQuery
  ): Promise<UploadItemImagesResponse> {
    return this.http.post<UploadItemImagesResponse>({
      path: ['items', itemId, 'images'],
      body: data,
      query: params,
    })
  }

  async deleteImages(itemId: string, documentIds: string): Promise<DeleteItemImagesResponse> {
    return this.http.delete<DeleteItemImagesResponse>({
      path: ['items', itemId, 'images'],
      query: { document_ids: documentIds },
    })
  }

  async reorderImages(
    itemId: string,
    data: ReorderItemImagesRequest
  ): Promise<ReorderItemImagesResponse> {
    return this.http.post<ReorderItemImagesResponse>({
      path: ['items', itemId, 'images', 'reorder'],
      body: data,
    })
  }

  async uploadBackImage(
    itemId: string,
    data: unknown,
    documentId?: string
  ): Promise<UploadItemBackImageResponse> {
    return this.http.post<UploadItemBackImageResponse>({
      path: ['items', itemId, 'backimage'],
      body: data,
      query: { document_id: documentId },
    })
  }

  async deleteBackImage(itemId: string, documentId?: string): Promise<DeleteItemBackImageResponse> {
    return this.http.delete<DeleteItemBackImageResponse>({
      path: ['items', itemId, 'backimage'],
      query: { document_id: documentId },
    })
  }

  async markImageAsBackImage(
    itemId: string,
    imageId: string
  ): Promise<MarkImageAsBackImageResponse> {
    return this.http.put<MarkImageAsBackImageResponse>({
      path: ['items', itemId, 'images', imageId, 'backimage'],
    })
  }

  async bulkMarkAsActive(itemIds: string): Promise<BulkMarkItemsActiveResponse> {
    return this.http.post<BulkMarkItemsActiveResponse>({
      path: ['items', 'active'],
      query: { item_ids: itemIds },
    })
  }

  async bulkMarkAsInactive(itemIds: string): Promise<BulkMarkItemsInactiveResponse> {
    return this.http.post<BulkMarkItemsInactiveResponse>({
      path: ['items', 'inactive'],
      query: { item_ids: itemIds },
    })
  }

  async ungroup(itemIds?: string, compositeItemIds?: string): Promise<UngroupItemsResponse> {
    return this.http.post<UngroupItemsResponse>({
      path: ['items', 'ungroup'],
      query: { item_ids: itemIds, composite_item_ids: compositeItemIds },
    })
  }

  async enableStorageLocation(itemIds: string): Promise<EnableStorageLocationResponse> {
    return this.http.post<EnableStorageLocationResponse>({
      path: ['items', 'enablestoragelocation'],
      query: { item_ids: itemIds },
    })
  }

  async disableStorageLocation(itemIds: string): Promise<DisableStorageLocationResponse> {
    return this.http.post<DisableStorageLocationResponse>({
      path: ['items', 'disablestoragelocation'],
      query: { item_ids: itemIds },
    })
  }

  async move(itemId: string, data: MoveItemRequest): Promise<MoveItemResponse> {
    return this.http.put<MoveItemResponse>({ path: ['items', 'move', itemId], body: data })
  }

  async group(groupId: string, data: GroupItemsRequest): Promise<GroupItemsResponse> {
    return this.http.put<GroupItemsResponse>({
      path: ['items', 'grouping', groupId],
      body: data,
    })
  }

  async updateLocationPermissions(
    itemId: string,
    associatedWithAllLocations: boolean,
    allowedLocationIds?: string
  ): Promise<UpdateItemLocationPermissionsResponse> {
    return this.http.put<UpdateItemLocationPermissionsResponse>({
      path: ['items', itemId, 'locations', 'permissions'],
      query: {
        associated_with_all_locations: associatedWithAllLocations,
        allowed_location_ids: allowedLocationIds,
      },
    })
  }

  async bulkUpdateLocationPermissions(
    params?: BulkUpdateItemLocationPermissionsQuery
  ): Promise<BulkUpdateItemLocationPermissionsResponse> {
    return this.http.put<BulkUpdateItemLocationPermissionsResponse>({
      path: ['items', 'locations', 'permissions'],
      query: params,
    })
  }

  async validateSerialNumbers(
    itemId: string,
    entityType: string,
    serialNumbers: string,
    params?: Omit<ValidateSerialNumbersQuery, 'entity_type' | 'serial_numbers'>
  ): Promise<ValidateSerialNumbersResponse> {
    return this.http.post<ValidateSerialNumbersResponse>({
      path: ['items', itemId, 'serialnumber', 'validate'],
      query: { entity_type: entityType, serial_numbers: serialNumbers, ...params },
    })
  }

  async validateAndMapSerialNumbers(
    itemId: string,
    data: ValidateAndMapSerialNumbersRequest
  ): Promise<ValidateAndMapSerialNumbersResponse> {
    return this.http.post<ValidateAndMapSerialNumbersResponse>({
      path: ['items', itemId, 'serialnumber', 'validateandmap'],
      body: data,
    })
  }

  async listSalesOrders(
    itemId: string,
    params?: Omit<ListItemSalesOrdersQuery, 'item_id'>
  ): Promise<ListItemSalesOrdersResponse['salesorders']> {
    const { salesorders } = await this.http.get<ListItemSalesOrdersResponse>({
      path: ['items', 'transactions', 'salesorders'],
      query: { item_id: itemId, ...params },
    })
    return salesorders
  }

  async listPurchaseOrders(
    itemId: string,
    params?: Omit<ListItemPurchaseOrdersQuery, 'item_id'>
  ): Promise<ListItemPurchaseOrdersResponse['purchaseorders']> {
    const { purchaseorders } = await this.http.get<ListItemPurchaseOrdersResponse>({
      path: ['items', 'transactions', 'purchaseorders'],
      query: { item_id: itemId, ...params },
    })
    return purchaseorders
  }

  async listInvoices(
    itemId: string,
    params?: Omit<ListItemInvoicesQuery, 'item_id'>
  ): Promise<ListItemInvoicesResponse['invoices']> {
    const { invoices } = await this.http.get<ListItemInvoicesResponse>({
      path: ['items', 'transactions', 'invoices'],
      query: { item_id: itemId, ...params },
    })
    return invoices
  }

  async listDeliveryChallans(
    itemId: string,
    params?: Omit<ListItemDeliveryChallansQuery, 'item_id'>
  ): Promise<ListItemDeliveryChallansResponse['deliverychallans']> {
    const { deliverychallans } = await this.http.get<ListItemDeliveryChallansResponse>({
      path: ['items', 'transactions', 'deliverychallans'],
      query: { item_id: itemId, ...params },
    })
    return deliverychallans
  }

  async listSalesReceipts(
    itemId: string,
    params?: Omit<ListItemSalesReceiptsQuery, 'item_id'>
  ): Promise<ListItemSalesReceiptsResponse['sales_receipts']> {
    const { sales_receipts } = await this.http.get<ListItemSalesReceiptsResponse>({
      path: ['items', 'transactions', 'salesreceipts'],
      query: { item_id: itemId, ...params },
    })
    return sales_receipts
  }

  async listMoveOrders(
    itemId: string,
    params?: Omit<ListItemMoveOrdersQuery, 'item_id'>
  ): Promise<ListItemMoveOrdersResponse['moveorders']> {
    const { moveorders } = await this.http.get<ListItemMoveOrdersResponse>({
      path: ['items', 'transactions', 'moveorders'],
      query: { item_id: itemId, ...params },
    })
    return moveorders
  }

  async listPutaways(
    itemId: string,
    params?: Omit<ListItemPutawaysQuery, 'item_id'>
  ): Promise<ListItemPutawaysResponse['putaways']> {
    const { putaways } = await this.http.get<ListItemPutawaysResponse>({
      path: ['items', 'transactions', 'putaways'],
      query: { item_id: itemId, ...params },
    })
    return putaways
  }
}
