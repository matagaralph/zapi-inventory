import type { ApiClient } from '../client';
import type {
  CreateCurrencyRequest,
  CreateCurrencyResponse,
  CurrencyResponse,
  DeleteCurrencyResponse,
  ListCurrencyResponse,
  UpdateCurrencyRequest,
  UpdateCurrencyResponse,
} from '../types/currency';

export class CurrencyModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Get list of currencies configured.
   * If opts.limit is provided, return at most that many items.
   */
  async list(opts?: {
    limit?: number;
    filterBy?: string;
  }): Promise<ListCurrencyResponse['currencies']> {
    return this.client.getList({
      path: ['settings', 'currencies'],
      params: opts?.filterBy ? { filter_by: opts.filterBy } : {},
      limit: opts?.limit,
      extractor: (res: ListCurrencyResponse) => res.currencies ?? [],
    });
  }
  async create(
    currency: CreateCurrencyRequest
  ): Promise<CreateCurrencyResponse['currency']> {
    const res = await this.client.post<CreateCurrencyResponse>({
      path: ['settings', 'currencies'],
      body: currency,
    });

    return res.currency;
  }

  async get(currencyId: string): Promise<CurrencyResponse> {
    const res = await this.client.get<{ currency: CurrencyResponse }>({
      path: ['settings', 'currencies', currencyId],
    });

    return res.currency;
  }

  async update(
    currencyId: string,
    currency: UpdateCurrencyRequest
  ): Promise<UpdateCurrencyResponse['currency']> {
    const res = await this.client.put<UpdateCurrencyResponse>({
      path: ['settings', 'currencies', currencyId],
      body: currency,
    });

    return res.currency;
  }

  async delete(currencyId: string): Promise<DeleteCurrencyResponse> {
    const res = await this.client.delete<DeleteCurrencyResponse>({
      path: ['settings', 'currencies', currencyId],
    });

    return res;
  }
}
