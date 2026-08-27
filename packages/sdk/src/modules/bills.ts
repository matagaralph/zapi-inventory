import type {
  ApprovalActionResponse,
  CreateBillRequest,
  CreateBillResponse,
  GetBillResponse,
  ListBillsResponse,
  MarkAsOpenResponse,
  MarkAsVoidResponse,
  RejectRequest,
  UpdateBillCustomfieldResponse,
  UpdateBillRequest,
  UpdateBillResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Bills {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListBillsResponse['bills']> {
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
  ): Promise<UpdateBillCustomfieldResponse> {
    return this.http.put<UpdateBillCustomfieldResponse>({
      path: ['bill', billId, 'customfields'],
      body: data,
    })
  }

  async markAsOpen(billId: string): Promise<MarkAsOpenResponse> {
    return this.http.post<MarkAsOpenResponse>({ path: ['bills', billId, 'status', 'open'] })
  }

  async markAsVoid(billId: string): Promise<MarkAsVoidResponse> {
    return this.http.post<MarkAsVoidResponse>({ path: ['bills', billId, 'status', 'void'] })
  }

  async submit(billId: string): Promise<ApprovalActionResponse> {
    return this.http.post<ApprovalActionResponse>({ path: ['bills', billId, 'submit'] })
  }

  async approve(billId: string): Promise<ApprovalActionResponse> {
    return this.http.post<ApprovalActionResponse>({ path: ['bills', billId, 'approve'] })
  }

  async approveFinal(billId: string): Promise<ApprovalActionResponse> {
    return this.http.post<ApprovalActionResponse>({ path: ['bills', billId, 'approve', 'final'] })
  }

  async reject(billId: string, data: RejectRequest): Promise<ApprovalActionResponse> {
    return this.http.post<ApprovalActionResponse>({ path: ['bills', billId, 'reject'], body: data })
  }

  async bulkSubmit(billIds: string): Promise<ApprovalActionResponse> {
    return this.http.post<ApprovalActionResponse>({
      path: ['bills', 'submit'],
      query: { bill_ids: billIds },
    })
  }

  async bulkApprove(billIds: string): Promise<ApprovalActionResponse> {
    return this.http.post<ApprovalActionResponse>({
      path: ['bills', 'approve'],
      query: { bill_ids: billIds },
    })
  }
}
