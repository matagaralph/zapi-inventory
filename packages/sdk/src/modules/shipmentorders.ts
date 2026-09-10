import type {
  CreateShipmentOrderRequest,
  CreateShipmentOrderResponse,
  GetShipmentOrderResponse,
  UpdateShipmentOrderRequest,
  UpdateShipmentOrderResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * A document used by an organization to specify what items or packages are to be transferred from a storage location or warehouse to what person and to what new location is called a shipment order. It is typically sent along with a shipment of goods so that the person receiving them(your customer) can verify that the document correctly reflects the items that they actually received.
 */
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
    await this.http.delete({
      path: ['shipmentorders', shipmentorderId],
    })
  }

  async markAsDelivered(shipmentorderId: string): Promise<void> {
    await this.http.post({
      path: ['shipmentorders', shipmentorderId, 'status', 'delivered'],
    })
  }
}
