import type { ApiClient } from '../client';
import type {
  CreatePurchaseReceiveRequest,
  CreatePurchaseReceiveResponse,
  RetrievePurchaseReceiveResponse,
  UpdatePurchaseReceiveRequest,
  UpdatePurchaseReceiveResponse,
} from '../types/purchasereceive';

export class PurchaseReceiveModule {
  constructor(private client: ApiClient) {}

  async create(
    purchaseReceive: CreatePurchaseReceiveRequest
  ): Promise<CreatePurchaseReceiveResponse['purchase_receive']> {
    const res = await this.client.post<CreatePurchaseReceiveResponse>({
      path: ['purchasereceives'],
      body: purchaseReceive,
    });
    return res.purchase_receive;
  }

  async get(
    purchaseReceiveId: string
  ): Promise<RetrievePurchaseReceiveResponse['purchase_receive']> {
    const res = await this.client.get<RetrievePurchaseReceiveResponse>({
      path: ['purchasereceives', purchaseReceiveId],
    });
    return res.purchase_receive;
  }

  async update(
    purchaseReceiveId: string,
    purchaseReceive: UpdatePurchaseReceiveRequest
  ): Promise<UpdatePurchaseReceiveResponse['purchase_receive']> {
    const res = await this.client.put<UpdatePurchaseReceiveResponse>({
      path: ['purchasereceives', purchaseReceiveId],
      body: purchaseReceive,
    });
    return res.purchase_receive;
  }

  delete(purchaseReceiveId: string): Promise<void> {
    return this.client.delete({
      path: ['purchasereceives', purchaseReceiveId],
    });
  }
}
