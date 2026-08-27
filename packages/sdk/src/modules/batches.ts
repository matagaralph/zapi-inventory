import type {
  BulkDeleteBatchesResponse,
  CreateBatchRequest,
  CreateBatchResponse,
  GetBatchResponse,
  ListBatchesResponse,
  MarkBatchAsActiveResponse,
  MarkBatchAsInactiveResponse,
  MarkBatchesAsActiveResponse,
  MarkBatchesAsInactiveResponse,
  UpdateBatchRequest,
  UpdateBatchResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Batches {
  constructor(private readonly http: HTTPClient) {}

  async list(
    itemId: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListBatchesResponse['batches']> {
    const { batches } = await this.http.get<ListBatchesResponse>({
      path: ['items', 'batches'],
      query: { item_id: itemId, ...params },
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

  async bulkDelete(batchIds: string): Promise<BulkDeleteBatchesResponse> {
    return this.http.delete<BulkDeleteBatchesResponse>({
      path: ['items', 'batches'],
      query: { batch_ids: batchIds },
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

  async markAsActive(batchId: string): Promise<MarkBatchAsActiveResponse> {
    return this.http.post<MarkBatchAsActiveResponse>({
      path: ['items', 'batches', batchId, 'active'],
    })
  }

  async markAsInactive(batchId: string): Promise<MarkBatchAsInactiveResponse> {
    return this.http.post<MarkBatchAsInactiveResponse>({
      path: ['items', 'batches', batchId, 'inactive'],
    })
  }

  async bulkMarkAsActive(batchIds: string): Promise<MarkBatchesAsActiveResponse> {
    return this.http.post<MarkBatchesAsActiveResponse>({
      path: ['items', 'batches', 'active'],
      query: { batch_ids: batchIds },
    })
  }

  async bulkMarkAsInactive(batchIds: string): Promise<MarkBatchesAsInactiveResponse> {
    return this.http.post<MarkBatchesAsInactiveResponse>({
      path: ['items', 'batches', 'inactive'],
      query: { batch_ids: batchIds },
    })
  }
}
