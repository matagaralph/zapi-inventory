import type {
  BulkApproveBillsQuery,
  BulkSubmitBillsQuery,
  CreateBillRequest,
  CreateBillResponse,
  GetBillResponse,
  ListBillsQuery,
  ListBillsResponse,
  RejectRequest,
  UpdateBillRequest,
  UpdateBillResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Bills {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListBillsQuery): Promise<ListBillsResponse['bills']> {
    const { bills } = await this.http.get<ListBillsResponse>({ path: ['bills'], query: params })
    return bills
  }

  async create(data: CreateBillRequest): Promise<CreateBillResponse['bill']> {
    const { bill } = await this.http.post<CreateBillResponse>({ path: ['bills'], body: data })
    return bill
  }

  async get(billId: string): Promise<GetBillResponse['bill']> {
    const { bill } = await this.http.get<GetBillResponse>({ path: ['bills', billId] })
    return bill
  }

  async update(billId: string, data: UpdateBillRequest): Promise<UpdateBillResponse['bill']> {
    const { bill } = await this.http.put<UpdateBillResponse>({
      path: ['bills', billId],
      body: data,
    })
    return bill
  }

  async delete(billId: string): Promise<void> {
    await this.http.delete({ path: ['bills', billId] })
  }

  async updateCustomField(
    billId: string,
    data: { customfield_id?: string; label?: string; value?: string }[]
  ): Promise<void> {
    await this.http.put({
      path: ['bill', billId, 'customfields'],
      body: data,
    })
  }

  async markAsOpen(billId: string): Promise<void> {
    await this.http.post({ path: ['bills', billId, 'status', 'open'] })
  }

  async markAsVoid(billId: string): Promise<void> {
    await this.http.post({ path: ['bills', billId, 'status', 'void'] })
  }

  async submit(billId: string): Promise<void> {
    await this.http.post({ path: ['bills', billId, 'submit'] })
  }

  async approve(billId: string): Promise<void> {
    await this.http.post({ path: ['bills', billId, 'approve'] })
  }

  async approveFinal(billId: string): Promise<void> {
    await this.http.post({ path: ['bills', billId, 'approve', 'final'] })
  }

  async reject(billId: string, data: RejectRequest): Promise<void> {
    await this.http.post({ path: ['bills', billId, 'reject'], body: data })
  }

  async bulkSubmit(params: BulkSubmitBillsQuery): Promise<void> {
    await this.http.post({
      path: ['bills', 'submit'],
      query: params,
    })
  }

  async bulkApprove(params: BulkApproveBillsQuery): Promise<void> {
    await this.http.post({
      path: ['bills', 'approve'],
      query: params,
    })
  }
}
