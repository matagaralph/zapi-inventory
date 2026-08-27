import type {
  CreateBulkLandedCostsRequest,
  CreateBulkLandedCostsResponse,
  CreateLandedCostForBillRequest,
  CreateLandedCostForBillResponse,
  GetBillDetailsForBulkLandedCostResponse,
  GetLandedCostForBillResponse,
  UpdateLandedCostForBillRequest,
  UpdateLandedCostForBillResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class LandedCosts {
  constructor(private readonly http: HTTPClient) {}

  async create(
    billId: string,
    data: CreateLandedCostForBillRequest
  ): Promise<CreateLandedCostForBillResponse['landed_cost']> {
    const { landed_cost } = await this.http.post<CreateLandedCostForBillResponse>({
      path: ['bills', billId, 'landedcosts'],
      body: data,
    })
    return landed_cost
  }

  async get(
    billId: string,
    landedCostId: string
  ): Promise<GetLandedCostForBillResponse['landed_cost']> {
    const { landed_cost } = await this.http.get<GetLandedCostForBillResponse>({
      path: ['bills', billId, 'landedcosts', landedCostId],
    })
    return landed_cost
  }

  async update(
    billId: string,
    landedCostId: string,
    data: UpdateLandedCostForBillRequest
  ): Promise<UpdateLandedCostForBillResponse['landed_cost']> {
    const { landed_cost } = await this.http.put<UpdateLandedCostForBillResponse>({
      path: ['bills', billId, 'landedcosts', landedCostId],
      body: data,
    })
    return landed_cost
  }

  async delete(billId: string, landedCostId: string): Promise<void> {
    await this.http.delete({ path: ['bills', billId, 'landedcosts', landedCostId] })
  }

  async createBulk(data: CreateBulkLandedCostsRequest): Promise<CreateBulkLandedCostsResponse> {
    return this.http.post<CreateBulkLandedCostsResponse>({
      path: ['bills', 'bulklandedcosts'],
      body: data,
    })
  }

  async getBillDetails(billIds: string): Promise<GetBillDetailsForBulkLandedCostResponse['bills']> {
    const { bills } = await this.http.get<GetBillDetailsForBulkLandedCostResponse>({
      path: ['landedcosts', 'billdetails'],
      query: { bill_ids: billIds },
    })
    return bills
  }
}
