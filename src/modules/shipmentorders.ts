import type { ApiClient } from '../client';
import type {
  CreateShipmentOrderRequest,
  UpdateShipmentOrderRequest,
  CreateShipmentOrderResponse,
  UpdateShipmentOrderResponse,
  RetrieveShipmentOrderResponse,
  DeleteShipmentOrderResponse,
  MarkAsDeliveredResponse,
} from '../types/shipmentorder';

export class ShipmentOrderModule {
  constructor(private client: ApiClient) {}

  async create(
    shipmentOrder: CreateShipmentOrderRequest,
    opts?: {
      packageIds?: string[];
      salesorderId?: string;
    }
  ): Promise<CreateShipmentOrderResponse['shipment_order']> {
    const params: Record<string, string> = {};

    if (opts?.packageIds) {
      params.package_ids = opts.packageIds.join(',');
    }

    if (opts?.salesorderId) {
      params.salesorder_id = opts.salesorderId;
    }
    const res = await this.client.post<CreateShipmentOrderResponse>({
      path: ['shipmentorders'],
      params,
      body: shipmentOrder,
    });
    return res.shipment_order;
  }

  async get(
    shipmentOrderId: string
  ): Promise<RetrieveShipmentOrderResponse['shipmentorder']> {
    const res = await this.client.get<RetrieveShipmentOrderResponse>({
      path: ['shipmentorders', shipmentOrderId],
    });
    return res.shipmentorder;
  }

  async update(
    shipmentOrderId: string,
    shipmentOrder: UpdateShipmentOrderRequest,
    opts: {
      packageIds: string[];
      salesorderId: string;
    }
  ): Promise<UpdateShipmentOrderResponse['shipmentorder']> {
    const params: Record<string, string> = {};

    if (opts?.packageIds) {
      params.package_ids = opts.packageIds.join(',');
    }

    if (opts?.salesorderId) {
      params.salesorder_id = opts.salesorderId;
    }

    const res = await this.client.put<UpdateShipmentOrderResponse>({
      path: ['shipmentorders', shipmentOrderId],
      params,
      body: shipmentOrder,
    });

    return res.shipmentorder;
  }

  async delete(shipmentOrderId: string): Promise<DeleteShipmentOrderResponse> {
    return this.client.delete({
      path: ['shipmentorders', shipmentOrderId],
    });
  }

  async markDelivered(
    shipmentOrderId: string
  ): Promise<MarkAsDeliveredResponse> {
    return this.client.post({
      path: ['shipmentorders', shipmentOrderId, 'status', 'delivered'],
    });
  }
}
