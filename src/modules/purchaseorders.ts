import type { ApiClient } from '../client';
import type {
  CreatePurchaseOrderRequest,
  CreatePurchaseOrderResponse,
  ListAllPurchaseOrdersResponse,
  RetrievePurchaseOrderResponse,
  UpdatePurchaseOrderRequest,
  UpdatePurchaseOrderResponse,
  DeletePurchaseOrderResponse,
  MarkAsIssuedResponse,
  MarkAsCancelledResponse,
} from '../types/purchaseorder';

export class PurchaseOrderModule {
  constructor(private client: ApiClient) {}

  async list(opts?: {
    limit: number;
  }): Promise<ListAllPurchaseOrdersResponse['purchaseorders']> {
    return this.client.getList({
      path: ['purchaseorders'],
      limit: opts?.limit,
      extractor: (res: ListAllPurchaseOrdersResponse) =>
        res.purchaseorders ?? [],
    });
  }

  async create(
    purchaseOrder: CreatePurchaseOrderRequest,
    params?: { ignore_auto_number_generation?: boolean }
  ): Promise<CreatePurchaseOrderResponse['purchase_order']> {
    const res = await this.client.post<CreatePurchaseOrderResponse>({
      path: ['purchaseorders'],
      params,
      body: purchaseOrder,
    });
    return res.purchase_order;
  }

  async get(
    purchaseOrderId: string
  ): Promise<RetrievePurchaseOrderResponse['purchase_order']> {
    const res = await this.client.get<RetrievePurchaseOrderResponse>({
      path: ['purchaseorders', purchaseOrderId],
    });
    return res.purchase_order;
  }

  async update(
    purchaseOrderId: string,
    purchaseOrder: UpdatePurchaseOrderRequest,
    ignoreAutoNumberGeneration?: boolean
  ): Promise<UpdatePurchaseOrderResponse['purchase_order']> {
    const params = ignoreAutoNumberGeneration
      ? { ignore_auto_number_generation: true }
      : undefined;

    const res = await this.client.put<UpdatePurchaseOrderResponse>({
      path: ['purchaseorders', purchaseOrderId],
      params,
      body: purchaseOrder,
    });

    return res.purchase_order;
  }

  async delete(purchaseOrderId: string): Promise<DeletePurchaseOrderResponse> {
    return this.client.delete({
      path: ['purchaseorders', purchaseOrderId],
    });
  }

  async markIssued(purchaseOrderId: string): Promise<MarkAsIssuedResponse> {
    return this.client.post({
      path: ['purchaseorders', purchaseOrderId, 'issued'],
    });
  }

  async markCancelled(
    purchaseOrderId: string
  ): Promise<MarkAsCancelledResponse> {
    return this.client.post({
      path: ['purchaseorders', purchaseOrderId, 'cancelled'],
    });
  }
}
