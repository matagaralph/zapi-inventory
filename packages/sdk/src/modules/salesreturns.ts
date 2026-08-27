import type {
  CreateSalesReturnReceiveRequest,
  CreateSalesReturnReceiveResponse,
  CreateSalesReturnRequest,
  CreateSalesReturnResponse,
  DeleteSalesReturnReceiveResponse,
  DeleteSalesReturnResponse,
  GetSalesReturnResponse,
  ListSalesReturnsResponse,
  UpdateSalesReturnRequest,
  UpdateSalesReturnResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class SalesReturns {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListSalesReturnsResponse['salesreturns']> {
    const { salesreturns } = await this.http.get<ListSalesReturnsResponse>({
      path: ['salesreturns'],
      query: params,
    })
    return salesreturns
  }

  async create(
    data: CreateSalesReturnRequest,
    salesorderId?: string
  ): Promise<CreateSalesReturnResponse['salesreturn']> {
    const { salesreturn } = await this.http.post<CreateSalesReturnResponse>({
      path: ['salesreturns'],
      query: { salesorder_id: salesorderId },
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
    salesorderId?: string
  ): Promise<UpdateSalesReturnResponse['salesreturn']> {
    const { salesreturn } = await this.http.put<UpdateSalesReturnResponse>({
      path: ['salesreturns', salesreturnId],
      query: { salesorder_id: salesorderId },
      body: data,
    })
    return salesreturn
  }

  async delete(salesreturnId: string): Promise<void> {
    await this.http.delete<DeleteSalesReturnResponse>({ path: ['salesreturns', salesreturnId] })
  }

  async createReceive(
    data: CreateSalesReturnReceiveRequest,
    salesreturnId?: string
  ): Promise<CreateSalesReturnReceiveResponse['salesreturn']> {
    const { salesreturn } = await this.http.post<CreateSalesReturnReceiveResponse>({
      path: ['salesreturnreceives'],
      query: { salesreturn_id: salesreturnId },
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
