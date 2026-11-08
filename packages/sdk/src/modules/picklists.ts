import type {
  AdvancedTrackingResponse,
  BulkDeletePicklistsQuery,
  BulkSetPicklistStatusQuery,
  CommentResponse,
  CreatePicklistRequest,
  CreatePicklistQuery,
  GetPicklistQuery,
  ListPicklistsQuery,
  ListPicklistsResponse,
  PicklistResponse,
  PicklistsAddCommentRequest,
  SearchPrLineItemsForPicklistQuery,
  SearchPrLineItemsResponse,
  SearchSalesOrdersForPicklistQuery,
  SearchSalesOrdersResponse,
  SearchSoLineItemsForPicklistQuery,
  SearchSoLineItemsResponse,
  SetPicklistStatusQuery,
  UpdateAdvancedTrackingRequest,
  UpdatePicklistRequest,
  UpdatePicklistQuery,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export type PicklistStatus = 'yettostart' | 'inprogress' | 'onhold' | 'completed'

/**
 * Picklists help teams track and manage the picking of items for sales orders and purchase returns. You can create picklists, assign them to staff, track picking progress by status, and add comments for collaboration.
 */
export function createPicklists(http: HTTPClient) {
  return {
    async list(params?: ListPicklistsQuery): Promise<ListPicklistsResponse['picklists']> {
      const { picklists } = await http.get<ListPicklistsResponse>({
        path: ['picklists'],
        query: { ...params },
      })
      return picklists
    },

    async create(
      data: CreatePicklistRequest,
      params?: CreatePicklistQuery
    ): Promise<PicklistResponse['picklist']> {
      const { picklist } = await http.post<PicklistResponse>({
        path: ['picklists'],
        body: data,
        query: { ...params },
      })
      return picklist
    },

    async bulkDelete(params: BulkDeletePicklistsQuery): Promise<void> {
      await http.delete({
        path: ['picklists'],
        query: params,
      })
    },

    async get(
      picklistId: string,
      params?: GetPicklistQuery
    ): Promise<PicklistResponse['picklist']> {
      const { picklist } = await http.get<PicklistResponse>({
        path: ['picklists', picklistId],
        query: { ...params },
      })
      return picklist
    },

    async update(
      picklistId: string,
      data: UpdatePicklistRequest,
      params?: UpdatePicklistQuery
    ): Promise<PicklistResponse['picklist']> {
      const { picklist } = await http.put<PicklistResponse>({
        path: ['picklists', picklistId],
        body: data,
        query: { ...params },
      })
      return picklist
    },

    async delete(picklistId: string): Promise<void> {
      await http.delete({ path: ['picklists', picklistId] })
    },

    async setStatus(picklistId: string, params: SetPicklistStatusQuery): Promise<void> {
      await http.post({
        path: ['picklists', picklistId, 'setstatus'],
        query: params,
      })
    },

    async bulkSetStatus(params: BulkSetPicklistStatusQuery): Promise<void> {
      await http.post({
        path: ['picklists', 'setstatus'],
        query: params,
      })
    },

    async addComment(
      picklistId: string,
      data: PicklistsAddCommentRequest
    ): Promise<CommentResponse['comment']> {
      const { comment } = await http.post<CommentResponse>({
        path: ['picklists', picklistId, 'comments'],
        body: data,
      })
      return comment
    },

    async deleteComment(picklistId: string, commentId: string): Promise<void> {
      await http.delete({ path: ['picklists', picklistId, 'comments', commentId] })
    },

    async getAdvancedTracking(
      picklistId: string
    ): Promise<AdvancedTrackingResponse['transaction']> {
      const { transaction } = await http.get<AdvancedTrackingResponse>({
        path: ['picklists', picklistId, 'advancedtrackingdetails'],
      })
      return transaction
    },

    async updateAdvancedTracking(
      picklistId: string,
      data: UpdateAdvancedTrackingRequest
    ): Promise<void> {
      await http.put({
        path: ['picklists', picklistId, 'advancedtrackingdetails'],
        body: data,
      })
    },

    async searchSoLineItems(
      params?: SearchSoLineItemsForPicklistQuery
    ): Promise<SearchSoLineItemsResponse['so_line_items']> {
      const { so_line_items } = await http.get<SearchSoLineItemsResponse>({
        path: ['picklists', 'searchsolineitems'],
        query: { ...params },
      })
      return so_line_items
    },

    async searchSalesOrders(
      params?: SearchSalesOrdersForPicklistQuery
    ): Promise<SearchSalesOrdersResponse['salesorders']> {
      const { salesorders } = await http.get<SearchSalesOrdersResponse>({
        path: ['picklists', 'searchso'],
        query: { ...params },
      })
      return salesorders
    },

    async searchPrLineItems(
      params?: SearchPrLineItemsForPicklistQuery
    ): Promise<SearchPrLineItemsResponse['pr_line_items']> {
      const { pr_line_items } = await http.get<SearchPrLineItemsResponse>({
        path: ['picklists', 'searchprlineitems'],
        query: { ...params },
      })
      return pr_line_items
    },
  }
}

export type Picklists = ReturnType<typeof createPicklists>
