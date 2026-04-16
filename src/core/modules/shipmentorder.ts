import type { HttpClient } from '@/client';
import { MODULES } from '@/core/constants';
import type { CreateShipmentOrder, ShipmentOrder } from '@/types/shipmentorder';

export class ShipmentOrderResource {
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  public async create(opts: CreateShipmentOrder): Promise<ShipmentOrder> {
    const { salesorder_id, package_ids, ...body } = opts;

    const res = await this.http.post<{ shipmentorder: ShipmentOrder }>({
      path: [MODULES.SHIPMENT_ORDER.PATH],
      body,
      query: {
        salesorder_id,
        package_ids,
      },
    });

    return res[MODULES.SHIPMENT_ORDER.RESPONSE_KEY.SINGULAR];
  }

  async get(shipmentOrderId: string): Promise<ShipmentOrder> {
    const res = await this.http.get<{ shipmentorder: ShipmentOrder }>({
      path: [MODULES.SHIPMENT_ORDER.PATH, shipmentOrderId],
    });
    return res[MODULES.SHIPMENT_ORDER.RESPONSE_KEY.SINGULAR];
  }

  async delete(shipmentOrderId: string) {
    return await this.http.delete({
      path: [MODULES.SHIPMENT_ORDER.PATH, shipmentOrderId],
    });
  }

  /**
   * Mark a shipment order as delivered.
   * @param shipmentOrderId - The ID of the shipment order
   * @param eventTime - The exact time the shipment was delivered.
   * Expected format: "YYYY-MM-DD HH:mm"
   */
  async markAsDelivered(shipmentOrderId: string, eventTime: string) {
    await this.http.post({
      path: [MODULES.SHIPMENT_ORDER.PATH, shipmentOrderId, 'setstatusasdelivered'],
      body: { event_time: eventTime },
    });
  }
}
