import type {
  CreateInventoryAdjustmentRequest,
  CreateInventoryAdjustmentResponse,
  DeleteInventoryAdjustmentResponse,
  GetInventoryAdjustmentResponse,
  InventoryadjustmentsApprovalActionResponse,
  InventoryadjustmentsRejectRequest,
  ListInventoryAdjustmentsResponse,
  UpdateInventoryAdjustmentRequest,
  UpdateInventoryAdjustmentResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class InventoryAdjustments {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListInventoryAdjustmentsResponse['inventory_adjustments']> {
    const { inventory_adjustments } = await this.http.get<ListInventoryAdjustmentsResponse>({
      path: ['inventoryadjustments'],
      query: { ...params },
    })
    return inventory_adjustments
  }

  async create(
    data: CreateInventoryAdjustmentRequest
  ): Promise<CreateInventoryAdjustmentResponse['inventory_adjustment']> {
    const { inventory_adjustment } = await this.http.post<CreateInventoryAdjustmentResponse>({
      path: ['inventoryadjustments'],
      body: data,
    })
    return inventory_adjustment
  }

  async get(
    inventoryAdjustmentId: string
  ): Promise<GetInventoryAdjustmentResponse['inventory_adjustment']> {
    const { inventory_adjustment } = await this.http.get<GetInventoryAdjustmentResponse>({
      path: ['inventoryadjustments', inventoryAdjustmentId],
    })
    return inventory_adjustment
  }

  async update(
    inventoryAdjustmentId: string,
    data: UpdateInventoryAdjustmentRequest
  ): Promise<UpdateInventoryAdjustmentResponse['inventory_adjustment']> {
    const { inventory_adjustment } = await this.http.put<UpdateInventoryAdjustmentResponse>({
      path: ['inventoryadjustments', inventoryAdjustmentId],
      body: data,
    })
    return inventory_adjustment
  }

  async delete(inventoryAdjustmentId: string): Promise<DeleteInventoryAdjustmentResponse> {
    return this.http.delete<DeleteInventoryAdjustmentResponse>({
      path: ['inventoryadjustments', inventoryAdjustmentId],
    })
  }

  async submit(inventoryAdjustmentId: string): Promise<InventoryadjustmentsApprovalActionResponse> {
    return this.http.post<InventoryadjustmentsApprovalActionResponse>({
      path: ['inventoryadjustments', inventoryAdjustmentId, 'submit'],
    })
  }

  async approve(
    inventoryAdjustmentId: string
  ): Promise<InventoryadjustmentsApprovalActionResponse> {
    return this.http.post<InventoryadjustmentsApprovalActionResponse>({
      path: ['inventoryadjustments', inventoryAdjustmentId, 'approve'],
    })
  }

  async approveFinal(
    inventoryAdjustmentId: string
  ): Promise<InventoryadjustmentsApprovalActionResponse> {
    return this.http.post<InventoryadjustmentsApprovalActionResponse>({
      path: ['inventoryadjustments', inventoryAdjustmentId, 'approve', 'final'],
    })
  }

  async reject(
    inventoryAdjustmentId: string,
    data?: InventoryadjustmentsRejectRequest
  ): Promise<InventoryadjustmentsApprovalActionResponse> {
    return this.http.post<InventoryadjustmentsApprovalActionResponse>({
      path: ['inventoryadjustments', inventoryAdjustmentId, 'reject'],
      body: data,
    })
  }
}
