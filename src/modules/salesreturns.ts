import type { ApiClient } from '../client';
import type {
  CreateSalesReturnRequest,
  CreateSalesReturnResponse,
  ListAllSalesReturnsResponse,
  UpdateSalesReturnRequest,
  UpdateSalesReturnResponse,
  RetrieveSalesReturnResponse,
  DeleteSalesReturnResponse,
  CreateSalesReturnReceiveRequest,
  CreateSalesReturnReceiveResponse,
  DeleteSalesReturnReceiveResponse,
} from '../types/salesreturn';

export class SalesReturnModule {
  constructor(private client: ApiClient) {}

  async list(opts?: {
    limit: number;
  }): Promise<ListAllSalesReturnsResponse['salesreturns']> {
    //@ts-expect-error
    return this.client.getList({
      path: ['salesreturns'],
      limit: opts?.limit,
      //@ts-expect-error ralph look at this
      extractor: (res: ListAllSalesReturnsResponse) => res.salesreturns ?? [],
    });
  }

  async create(
    data: CreateSalesReturnRequest,
    params?: { salesorder_id?: string }
  ): Promise<CreateSalesReturnResponse['salesreturn']> {
    const res = await this.client.post<CreateSalesReturnResponse>({
      path: ['salesreturns'],
      params,
      body: data,
    });
    return res.salesreturn;
  }

  async get(
    salesReturnId: string
  ): Promise<RetrieveSalesReturnResponse['salesreturn']> {
    const res = await this.client.get<RetrieveSalesReturnResponse>({
      path: ['salesreturns', salesReturnId],
    });
    return res.salesreturn;
  }

  async update(
    salesReturnId: string,
    data: UpdateSalesReturnRequest,
    params?: { salesorder_id?: string }
  ): Promise<UpdateSalesReturnResponse['salesreturn']> {
    const res = await this.client.put<UpdateSalesReturnResponse>({
      path: ['salesreturns', salesReturnId],
      params,
      body: data,
    });
    return res.salesreturn;
  }

  async delete(salesReturnId: string): Promise<DeleteSalesReturnResponse> {
    return this.client.delete({
      path: ['salesreturns', salesReturnId],
    });
  }

  async createReceive(
    salesReturnId: string,
    data: CreateSalesReturnReceiveRequest
  ): Promise<CreateSalesReturnReceiveResponse['salesreturn']> {
    const res = await this.client.post<CreateSalesReturnReceiveResponse>({
      path: ['salesreturns', salesReturnId, 'receive'],
      body: data,
    });
    return res.salesreturn;
  }

  async deleteReceive(
    salesReturnReceiveId: string
  ): Promise<DeleteSalesReturnReceiveResponse> {
    return this.client.delete({
      path: ['salesreturnreceives', salesReturnReceiveId],
    });
  }
}
