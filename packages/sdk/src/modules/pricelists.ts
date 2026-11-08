import type {
  CreatePricebookRequest,
  CreatePricebookResponse,
  ListPricebooksQuery,
  ListPricebooksResponse,
  UpdatePricebookRequest,
  UpdatePricebookResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * Price lists used to increase or decrease a product selling or purchase price by a percentage or amount
 */
export function createPriceLists(http: HTTPClient) {
  return {
    async list(params?: ListPricebooksQuery): Promise<ListPricebooksResponse['pricebooks']> {
      const { pricebooks } = await http.get<ListPricebooksResponse>({
        path: ['pricebooks'],
        query: { ...params },
      })
      return pricebooks
    },

    async create(data: CreatePricebookRequest): Promise<CreatePricebookResponse['pricebook']> {
      const { pricebook } = await http.post<CreatePricebookResponse>({
        path: ['pricebooks'],
        body: data,
      })
      return pricebook
    },

    async update(
      pricebookId: string,
      data: UpdatePricebookRequest
    ): Promise<UpdatePricebookResponse['pricebook']> {
      const { pricebook } = await http.put<UpdatePricebookResponse>({
        path: ['pricebooks', pricebookId],
        body: data,
      })
      return pricebook
    },

    async delete(pricebookId: string): Promise<void> {
      await http.delete({ path: ['pricebooks', pricebookId] })
    },

    async markAsActive(pricebookId: string): Promise<void> {
      await http.post({
        path: ['pricebooks', pricebookId, 'active'],
      })
    },

    async markAsInactive(pricebookId: string): Promise<void> {
      await http.post({
        path: ['pricebooks', pricebookId, 'inactive'],
      })
    },
  }
}

export type PriceLists = ReturnType<typeof createPriceLists>
