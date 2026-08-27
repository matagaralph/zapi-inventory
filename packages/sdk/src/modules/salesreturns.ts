import type {
  CreateSalesReturnReceiveRequest,
  CreateSalesReturnReceiveQuery,
  CreateSalesReturnReceiveResponse,
  CreateSalesReturnRequest,
  CreateSalesReturnQuery,
  CreateSalesReturnResponse,
  DeleteSalesReturnReceiveResponse,
  DeleteSalesReturnResponse,
  GetSalesReturnResponse,
  ListSalesReturnsQuery,
  ListSalesReturnsResponse,
  UpdateSalesReturnQuery,
  UpdateSalesReturnRequest,
  UpdateSalesReturnResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class SalesReturns {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListSalesReturnsQuery): Promise<ListSalesReturnsResponse['salesreturns']> {
    const { salesreturns } = await this.http.get<ListSalesReturnsResponse>({
      path: ['salesreturns'],
      query: params,
    })
    return salesreturns
  }

  async create(
    data: CreateSalesReturnRequest,
    params?: CreateSalesReturnQuery
  ): Promise<CreateSalesReturnResponse['salesreturn']> {
    const { salesreturn } = await this.http.post<CreateSalesReturnResponse>({
      path: ['salesreturns'],
      query: params,
      body: data,
    })
    return salesreturn
  }

  async get(salesreturnId: string): Promise<GetSalesReturnResponse['salesreturn']> {
    const { salesreturn } = await this.http.get<GetSalesReturnResponse>({
      path: ['salesreturns', salesreturnId],
    })
    return salesreturn
  }

  async update(
    salesreturnId: string,
    data: UpdateSalesReturnRequest,
    params?: UpdateSalesReturnQuery
  ): Promise<UpdateSalesReturnResponse['salesreturn']> {
    const { salesreturn } = await this.http.put<UpdateSalesReturnResponse>({
      path: ['salesreturns', salesreturnId],
      query: params,
      body: data,
    })
    return salesreturn
  }

  async delete(salesreturnId: string): Promise<void> {
    await this.http.delete<DeleteSalesReturnResponse>({ path: ['salesreturns', salesreturnId] })
  }

  async createReceive(
    data: CreateSalesReturnReceiveRequest,
    params?: CreateSalesReturnReceiveQuery
  ): Promise<CreateSalesReturnReceiveResponse['salesreturn']> {
    const { salesreturn } = await this.http.post<CreateSalesReturnReceiveResponse>({
      path: ['salesreturnreceives'],
      query: params,
      body: data,
    })
    return salesreturn
  }

  async deleteReceive(salesreturnreceiveId: string): Promise<void> {
    await this.http.delete<DeleteSalesReturnReceiveResponse>({
      path: ['salesreturnreceives', salesreturnreceiveId],
    })
  }
}
