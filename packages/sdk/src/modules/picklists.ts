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
  MessageResponse,
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

export class Picklists {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListPicklistsQuery): Promise<ListPicklistsResponse['picklists']> {
    const { picklists } = await this.http.get<ListPicklistsResponse>({
      path: ['picklists'],
      query: { ...params },
    })
    return picklists
  }

  async create(
    data: CreatePicklistRequest,
    params?: CreatePicklistQuery
  ): Promise<PicklistResponse['picklist']> {
    const { picklist } = await this.http.post<PicklistResponse>({
      path: ['picklists'],
      body: data,
      query: { ...params },
    })
    return picklist
  }

  async bulkDelete(params: BulkDeletePicklistsQuery): Promise<MessageResponse> {
    return this.http.delete<MessageResponse>({
      path: ['picklists'],
      query: params,
    })
  }

  async get(picklistId: string, params?: GetPicklistQuery): Promise<PicklistResponse['picklist']> {
    const { picklist } = await this.http.get<PicklistResponse>({
      path: ['picklists', picklistId],
      query: { ...params },
    })
    return picklist
  }

  async update(
    picklistId: string,
    data: UpdatePicklistRequest,
    params?: UpdatePicklistQuery
  ): Promise<PicklistResponse['picklist']> {
    const { picklist } = await this.http.put<PicklistResponse>({
      path: ['picklists', picklistId],
      body: data,
      query: { ...params },
    })
    return picklist
  }

  async delete(picklistId: string): Promise<void> {
    await this.http.delete({ path: ['picklists', picklistId] })
  }

  async setStatus(picklistId: string, params: SetPicklistStatusQuery): Promise<MessageResponse> {
    return this.http.post<MessageResponse>({
      path: ['picklists', picklistId, 'setstatus'],
      query: params,
    })
  }

  async bulkSetStatus(params: BulkSetPicklistStatusQuery): Promise<MessageResponse> {
    return this.http.post<MessageResponse>({
      path: ['picklists', 'setstatus'],
      query: params,
    })
  }

  async addComment(
    picklistId: string,
    data: PicklistsAddCommentRequest
  ): Promise<CommentResponse['comment']> {
    const { comment } = await this.http.post<CommentResponse>({
      path: ['picklists', picklistId, 'comments'],
      body: data,
    })
    return comment
  }

  async deleteComment(picklistId: string, commentId: string): Promise<void> {
    await this.http.delete({ path: ['picklists', picklistId, 'comments', commentId] })
  }

  async getAdvancedTracking(picklistId: string): Promise<AdvancedTrackingResponse['transaction']> {
    const { transaction } = await this.http.get<AdvancedTrackingResponse>({
      path: ['picklists', picklistId, 'advancedtrackingdetails'],
    })
    return transaction
  }

  async updateAdvancedTracking(
    picklistId: string,
    data: UpdateAdvancedTrackingRequest
  ): Promise<MessageResponse> {
    return this.http.put<MessageResponse>({
      path: ['picklists', picklistId, 'advancedtrackingdetails'],
      body: data,
    })
  }

  async searchSoLineItems(
    params?: SearchSoLineItemsForPicklistQuery
  ): Promise<SearchSoLineItemsResponse['so_line_items']> {
    const { so_line_items } = await this.http.get<SearchSoLineItemsResponse>({
      path: ['picklists', 'searchsolineitems'],
      query: { ...params },
    })
    return so_line_items
  }

  async searchSalesOrders(
    params?: SearchSalesOrdersForPicklistQuery
  ): Promise<SearchSalesOrdersResponse['salesorders']> {
    const { salesorders } = await this.http.get<SearchSalesOrdersResponse>({
      path: ['picklists', 'searchso'],
      query: { ...params },
    })
    return salesorders
  }

  async searchPrLineItems(
    params?: SearchPrLineItemsForPicklistQuery
  ): Promise<SearchPrLineItemsResponse['pr_line_items']> {
    const { pr_line_items } = await this.http.get<SearchPrLineItemsResponse>({
      path: ['picklists', 'searchprlineitems'],
      query: { ...params },
    })
    return pr_line_items
  }
}
