import type {
  CreatePricebookRequest,
  CreatePricebookResponse,
  ListPricebooksQuery,
  ListPricebooksResponse,
  UpdatePricebookRequest,
  UpdatePricebookResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class PriceLists {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListPricebooksQuery): Promise<ListPricebooksResponse['pricebooks']> {
    const { pricebooks } = await this.http.get<ListPricebooksResponse>({
      path: ['pricebooks'],
      query: { ...params },
    })
    return pricebooks
  }

  async create(data: CreatePricebookRequest): Promise<CreatePricebookResponse['pricebook']> {
    const { pricebook } = await this.http.post<CreatePricebookResponse>({
      path: ['pricebooks'],
      body: data,
    })
    return pricebook
  }

  async update(
    pricebookId: string,
    data: UpdatePricebookRequest
  ): Promise<UpdatePricebookResponse['pricebook']> {
    const { pricebook } = await this.http.put<UpdatePricebookResponse>({
      path: ['pricebooks', pricebookId],
      body: data,
    })
    return pricebook
  }

  async delete(pricebookId: string): Promise<void> {
    await this.http.delete({ path: ['pricebooks', pricebookId] })
  }

  async markAsActive(pricebookId: string): Promise<void> {
    await this.http.post({
      path: ['pricebooks', pricebookId, 'active'],
    })
  }

  async markAsInactive(pricebookId: string): Promise<void> {
    await this.http.post({
      path: ['pricebooks', pricebookId, 'inactive'],
    })
  }
}
