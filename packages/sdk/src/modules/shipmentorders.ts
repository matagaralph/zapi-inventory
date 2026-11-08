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
export function createShipmentOrders(http: HTTPClient) {
  return {
    async create(
      salesorderId: string,
      packageIds: string,
      data: CreateShipmentOrderRequest
    ): Promise<CreateShipmentOrderResponse['shipmentorder']> {
      const { shipmentorder } = await http.post<CreateShipmentOrderResponse>({
        path: ['shipmentorders'],
        query: { salesorder_id: salesorderId, package_ids: packageIds },
        body: data,
      })
      return shipmentorder
    },

    async get(shipmentorderId: string): Promise<GetShipmentOrderResponse['shipmentorder']> {
      const { shipmentorder } = await http.get<GetShipmentOrderResponse>({
        path: ['shipmentorders', shipmentorderId],
      })
      return shipmentorder
    },

    async update(
      shipmentorderId: string,
      salesorderId: string,
      packageIds: string,
      data: UpdateShipmentOrderRequest
    ): Promise<UpdateShipmentOrderResponse['shipmentorder']> {
      const { shipmentorder } = await http.put<UpdateShipmentOrderResponse>({
        path: ['shipmentorders', shipmentorderId],
        query: { salesorder_id: salesorderId, package_ids: packageIds },
        body: data,
      })
      return shipmentorder
    },

    async delete(shipmentorderId: string): Promise<void> {
      await http.delete({
        path: ['shipmentorders', shipmentorderId],
      })
    },

    async markAsDelivered(shipmentorderId: string): Promise<void> {
      await http.post({
        path: ['shipmentorders', shipmentorderId, 'status', 'delivered'],
      })
    },
  }
}

export type ShipmentOrders = ReturnType<typeof createShipmentOrders>
