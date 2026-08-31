import type {
  BulkDeleteBatchesQuery,
  CreateBatchRequest,
  CreateBatchResponse,
  GetBatchResponse,
  ListBatchesQuery,
  ListBatchesResponse,
  MarkBatchesAsActiveQuery,
  MarkBatchesAsInactiveQuery,
  UpdateBatchRequest,
  UpdateBatchResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Batches {
  constructor(private readonly http: HTTPClient) {}

  async list(params: ListBatchesQuery): Promise<ListBatchesResponse['batches']> {
    const { batches } = await this.http.get<ListBatchesResponse>({
      path: ['items', 'batches'],
      query: params,
    })
    return batches
  }

  async create(data: CreateBatchRequest): Promise<CreateBatchResponse['batch']> {
    const { batch } = await this.http.post<CreateBatchResponse>({
      path: ['items', 'batches'],
      body: data,
    })
    return batch
  }

  async bulkDelete(params: BulkDeleteBatchesQuery): Promise<void> {
    await this.http.delete({
      path: ['items', 'batches'],
      query: params,
    })
  }

  async get(batchId: string): Promise<GetBatchResponse['batch']> {
    const { batch } = await this.http.get<GetBatchResponse>({
      path: ['items', 'batches', batchId],
    })
    return batch
  }

  async update(batchId: string, data: UpdateBatchRequest): Promise<UpdateBatchResponse['batch']> {
    const { batch } = await this.http.put<UpdateBatchResponse>({
      path: ['items', 'batches', batchId],
      body: data,
    })
    return batch
  }

  async delete(batchId: string): Promise<void> {
    await this.http.delete({ path: ['items', 'batches', batchId] })
  }

  async markAsActive(batchId: string): Promise<void> {
    await this.http.post({
      path: ['items', 'batches', batchId, 'active'],
    })
  }

  async markAsInactive(batchId: string): Promise<void> {
    await this.http.post({
      path: ['items', 'batches', batchId, 'inactive'],
    })
  }

  async bulkMarkAsActive(params: MarkBatchesAsActiveQuery): Promise<void> {
    await this.http.post({
      path: ['items', 'batches', 'active'],
      query: params,
    })
  }

  async bulkMarkAsInactive(params: MarkBatchesAsInactiveQuery): Promise<void> {
    await this.http.post({
      path: ['items', 'batches', 'inactive'],
      query: params,
    })
  }
}
