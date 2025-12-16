import type { ApiClient } from '../client';
import type {
  CreatePricebookRequest,
  CreatePricebookResponse,
  ListAllPricebooksResponse,
  UpdatePricebookRequest,
  UpdatePricebookResponse,
} from '../types/pricelist';

export class PriceListModule {
  constructor(private client: ApiClient) {}

  async list(opts?: {
    limit: number;
  }): Promise<ListAllPricebooksResponse['pricebooks']> {
    return this.client.getList({
      path: ['pricebooks'],
      limit: opts?.limit,
      extractor: (res: ListAllPricebooksResponse) => res.pricebooks ?? [],
    });
  }

  async create(
    data: CreatePricebookRequest
  ): Promise<CreatePricebookResponse['pricebook']> {
    const res = await this.client.post<CreatePricebookResponse>({
      path: ['pricebooks'],
      body: data,
    });
    return res.pricebook;
  }

  async update(
    pricebookId: string,
    data: UpdatePricebookRequest
  ): Promise<UpdatePricebookResponse['pricebook']> {
    const res = await this.client.put<UpdatePricebookResponse>({
      path: ['pricebooks', pricebookId],
      body: data,
    });
    return res.pricebook;
  }

  delete(pricebookId: string): Promise<void> {
    return this.client.delete({
      path: ['pricebooks', pricebookId],
    });
  }

  markActive(pricebookId: string): Promise<void> {
    return this.client.post({
      path: ['pricebooks', pricebookId, 'active'],
    });
  }

  markInactive(pricebookId: string): Promise<void> {
    return this.client.post({
      path: ['pricebooks', pricebookId, 'inactive'],
    });
  }
}
