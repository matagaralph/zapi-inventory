import type {
  BulkFetchItemDetailsResponse,
  BulkUpdateItemLocationPermissionsQuery,
  CreateItemRequest,
  CreateItemResponse,
  GetItemResponse,
  GetVariantOpeningStockResponse,
  GroupItemsRequest,
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
  MoveItemRequest,
  ReorderItemImagesRequest,
  UpdateItemRequest,
  UpdateItemResponse,
  UpdateVariantOpeningStockRequest,
  UploadItemImagesQuery,
  ValidateAndMapSerialNumbersRequest,
  ValidateSerialNumbersQuery,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export interface ItemCustomFieldUpdate {
  customfield_id?: string
  label?: string
  value?: string
}

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

  async bulkDelete(itemIds?: string): Promise<void> {
    await this.http.delete({
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
    await this.http.delete({ path: ['items', itemId] })
  }

  async updateCustomField(itemId: string, data: ItemCustomFieldUpdate[]): Promise<void> {
    await this.http.put({
      path: ['item', itemId, 'customfields'],
      body: data,
    })
  }

  async getImage(itemId: string, preview?: boolean): Promise<Blob> {
    return this.http.get<Blob>({
      path: ['items', itemId, 'image'],
      query: { preview },
    })
  }

  async uploadImage(itemId: string, image: Blob): Promise<void> {
    const body = new FormData()
    body.append('image', image)
    await this.http.post({
      path: ['items', itemId, 'image'],
      body,
    })
  }

  async deleteImage(itemId: string): Promise<void> {
    await this.http.delete({ path: ['items', itemId, 'image'] })
  }

  async markAsActive(itemId: string): Promise<void> {
    await this.http.post({ path: ['items', itemId, 'active'] })
  }

  async markAsInactive(itemId: string): Promise<void> {
    await this.http.post({ path: ['items', itemId, 'inactive'] })
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
  ): Promise<void> {
    await this.http.put({
      path: ['variants', variantId, 'openingstock'],
      body: data,
    })
  }

  async uploadImages(
    itemId: string,
    images: Blob[],
    params?: UploadItemImagesQuery
  ): Promise<void> {
    const body = new FormData()
    for (const image of images) body.append('image', image)
    await this.http.post({
      path: ['items', itemId, 'images'],
      body,
      query: params,
    })
  }

  async deleteImages(itemId: string, documentIds: string): Promise<void> {
    await this.http.delete({
      path: ['items', itemId, 'images'],
      query: { document_ids: documentIds },
    })
  }

  async reorderImages(itemId: string, data: ReorderItemImagesRequest): Promise<void> {
    await this.http.post({
      path: ['items', itemId, 'images', 'reorder'],
      body: data,
    })
  }

  async uploadBackImage(itemId: string, backImage: Blob, documentId?: string): Promise<void> {
    const body = new FormData()
    body.append('back_image', backImage)
    await this.http.post({
      path: ['items', itemId, 'backimage'],
      body,
      query: { document_id: documentId },
    })
  }

  async deleteBackImage(itemId: string, documentId?: string): Promise<void> {
    await this.http.delete({
      path: ['items', itemId, 'backimage'],
      query: { document_id: documentId },
    })
  }

  async markImageAsBackImage(itemId: string, imageId: string): Promise<void> {
    await this.http.put({
      path: ['items', itemId, 'images', imageId, 'backimage'],
    })
  }

  async bulkMarkAsActive(itemIds: string): Promise<void> {
    await this.http.post({
      path: ['items', 'active'],
      query: { item_ids: itemIds },
    })
  }

  async bulkMarkAsInactive(itemIds: string): Promise<void> {
    await this.http.post({
      path: ['items', 'inactive'],
      query: { item_ids: itemIds },
    })
  }

  async ungroup(itemIds?: string, compositeItemIds?: string): Promise<void> {
    await this.http.post({
      path: ['items', 'ungroup'],
      query: { item_ids: itemIds, composite_item_ids: compositeItemIds },
    })
  }

  async enableStorageLocation(itemIds: string): Promise<void> {
    await this.http.post({
      path: ['items', 'enablestoragelocation'],
      query: { item_ids: itemIds },
    })
  }

  async disableStorageLocation(itemIds: string): Promise<void> {
    await this.http.post({
      path: ['items', 'disablestoragelocation'],
      query: { item_ids: itemIds },
    })
  }

  async move(itemId: string, data: MoveItemRequest): Promise<void> {
    await this.http.put({ path: ['items', 'move', itemId], body: data })
  }

  async group(groupId: string, data: GroupItemsRequest): Promise<void> {
    await this.http.put({
      path: ['items', 'grouping', groupId],
      body: data,
    })
  }

  async updateLocationPermissions(
    itemId: string,
    associatedWithAllLocations: boolean,
    allowedLocationIds?: string
  ): Promise<void> {
    await this.http.put({
      path: ['items', itemId, 'locations', 'permissions'],
      query: {
        associated_with_all_locations: associatedWithAllLocations,
        allowed_location_ids: allowedLocationIds,
      },
    })
  }

  async bulkUpdateLocationPermissions(
    params?: BulkUpdateItemLocationPermissionsQuery
  ): Promise<void> {
    await this.http.put({
      path: ['items', 'locations', 'permissions'],
      query: params,
    })
  }

  async validateSerialNumbers(
    itemId: string,
    entityType: string,
    serialNumbers: string,
    params?: Omit<ValidateSerialNumbersQuery, 'entity_type' | 'serial_numbers'>
  ): Promise<void> {
    await this.http.post({
      path: ['items', itemId, 'serialnumber', 'validate'],
      query: { entity_type: entityType, serial_numbers: serialNumbers, ...params },
    })
  }

  async validateAndMapSerialNumbers(
    itemId: string,
    data: ValidateAndMapSerialNumbersRequest
  ): Promise<void> {
    await this.http.post({
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
