import type {
  CreateCurrencyRequest,
  CreateCurrencyResponse,
  DeleteCurrencyResponse,
  GetCurrencyResponse,
  ListCurrencyResponse,
  UpdateCurrencyRequest,
  UpdateCurrencyResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Currencies {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListCurrencyResponse['currencies']> {
    const { currencies } = await this.http.get<ListCurrencyResponse>({
      path: ['settings', 'currencies'],
      query: { ...params },
    })
    return currencies
  }

  async create(data: CreateCurrencyRequest): Promise<CreateCurrencyResponse['currency']> {
    const { currency } = await this.http.post<CreateCurrencyResponse>({
      path: ['settings', 'currencies'],
      body: data,
    })
    return currency
  }

  async get(currencyId: string): Promise<GetCurrencyResponse['currency']> {
    const { currency } = await this.http.get<GetCurrencyResponse>({
      path: ['settings', 'currencies', currencyId],
    })
    return currency
  }

  async update(
    currencyId: string,
    data: UpdateCurrencyRequest
  ): Promise<UpdateCurrencyResponse['currency']> {
    const { currency } = await this.http.put<UpdateCurrencyResponse>({
      path: ['settings', 'currencies', currencyId],
      body: data,
    })
    return currency
  }

  async delete(currencyId: string): Promise<DeleteCurrencyResponse> {
    return this.http.delete<DeleteCurrencyResponse>({
      path: ['settings', 'currencies', currencyId],
    })
  }
}
