import type { ApiClient } from '../client';
import type {
  CreateTransferOrderRequest,
  CreateTransferOrderResponse,
  ListAllTheTransferOrdersResponse,
  UpdateTransferOrderRequest,
  UpdateTransferOrderResponse,
  RetrieveTransferOrderResponse,
} from '../types/transferorder';

export class TransferOrderModule {
  constructor(private client: ApiClient) {}

  async list(): Promise<ListAllTheTransferOrdersResponse['transfer_orders']> {
    return this.client.getList({
      path: ['transferorders'],
      extractor: (res: ListAllTheTransferOrdersResponse) =>
        res.transfer_orders ?? [],
    });
  }

  async create(
    data: CreateTransferOrderRequest,
    params?: { ignore_auto_number_generation?: boolean }
  ): Promise<CreateTransferOrderResponse['transfer_order']> {
    const res = await this.client.post<CreateTransferOrderResponse>({
      path: ['transferorders'],
      params,
      body: data,
    });
    return res.transfer_order;
  }

  async get(
    transferOrderId: string
  ): Promise<RetrieveTransferOrderResponse['transfer_order']> {
    const res = await this.client.get<RetrieveTransferOrderResponse>({
      path: ['transferorders', transferOrderId],
    });
    return res.transfer_order;
  }

  async update(
    transferOrderId: string,
    data: UpdateTransferOrderRequest
  ): Promise<UpdateTransferOrderResponse['transfer_order']> {
    const res = await this.client.put<UpdateTransferOrderResponse>({
      path: ['transferorders', transferOrderId],
      body: data,
    });
    return res.transfer_order;
  }

  delete(transferOrderId: string): Promise<void> {
    return this.client.delete({
      path: ['transferorders', transferOrderId],
    });
  }

  markReceived(transferOrderId: string): Promise<void> {
    return this.client.post({
      path: ['transferorders', transferOrderId, 'markastransferred'],
    });
  }
}
