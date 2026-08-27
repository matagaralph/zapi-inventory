import type {
  CreateShipmentOrderRequest,
  CreateShipmentOrderResponse,
  DeleteShipmentOrderResponse,
  GetShipmentOrderResponse,
  MarkAsDeliveredResponse,
  UpdateShipmentOrderRequest,
  UpdateShipmentOrderResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class ShipmentOrders {
  constructor(private readonly http: HTTPClient) {}

  async create(
    salesorderId: string,
    packageIds: string,
    data: CreateShipmentOrderRequest
  ): Promise<CreateShipmentOrderResponse['shipment_order']> {
    const { shipment_order } = await this.http.post<CreateShipmentOrderResponse>({
      path: ['shipmentorders'],
      query: { salesorder_id: salesorderId, package_ids: packageIds },
      body: data,
    })
    return shipment_order
  }

  async get(shipmentorderId: string): Promise<GetShipmentOrderResponse['shipment_order']> {
    const { shipment_order } = await this.http.get<GetShipmentOrderResponse>({
      path: ['shipmentorders', shipmentorderId],
    })
    return shipment_order
  }

  async update(
    shipmentorderId: string,
    salesorderId: string,
    packageIds: string,
    data: UpdateShipmentOrderRequest
  ): Promise<UpdateShipmentOrderResponse['shipmentorder']> {
    const { shipmentorder } = await this.http.put<UpdateShipmentOrderResponse>({
      path: ['shipmentorders', shipmentorderId],
      query: { salesorder_id: salesorderId, package_ids: packageIds },
      body: data,
    })
    return shipmentorder
  }

  async delete(shipmentorderId: string): Promise<void> {
    await this.http.delete<DeleteShipmentOrderResponse>({
      path: ['shipmentorders', shipmentorderId],
    })
  }

  async markAsDelivered(shipmentorderId: string): Promise<MarkAsDeliveredResponse> {
    return this.http.post<MarkAsDeliveredResponse>({
      path: ['shipmentorders', shipmentorderId, 'status', 'delivered'],
    })
  }
}
