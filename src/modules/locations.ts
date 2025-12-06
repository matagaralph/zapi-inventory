import type { ApiClient } from '../client';
import type {
  EnableLocationResponse,
  CreateLocationRequest,
  CreateLocationResponse,
  ListAllLocationResponse,
  UpdateLocationRequest,
  UpdateLocationResponse,
  DeleteLocationResponse,
  MarkAsActiveResponse,
  MarkAsInactiveResponse,
  MarkAsPrimaryResponse,
} from '../types/location';

export class LocationModule {
  constructor(private client: ApiClient) {}

  async enable(): Promise<EnableLocationResponse> {
    return this.client.post({
      path: ['settings', 'locations', 'enable'],
    });
  }

  async list(opts?: {
    limit: number;
  }): Promise<ListAllLocationResponse['locations']> {
    return this.client.getList({
      limit: opts?.limit,
      path: ['locationss'],
      extractor: (res: ListAllLocationResponse) => res.locations ?? [],
    });
  }

  async create(
    location: CreateLocationRequest
  ): Promise<CreateLocationResponse['locations']> {
    const res = await this.client.post<CreateLocationResponse>({
      path: ['locations'],
      body: location,
    });
    return res.locations;
  }

  async update(
    locationId: string,
    location: UpdateLocationRequest
  ): Promise<UpdateLocationResponse['locations']> {
    const res = await this.client.put<UpdateLocationResponse>({
      path: ['locations', locationId],
      body: location,
    });
    return res.locations;
  }

  async delete(locationId: string): Promise<DeleteLocationResponse> {
    return this.client.delete({
      path: ['locations', locationId],
    });
  }

  async markActive(locationId: string): Promise<MarkAsActiveResponse> {
    return this.client.post({
      path: ['locations', locationId, 'active'],
    });
  }

  async markInactive(locationId: string): Promise<MarkAsInactiveResponse> {
    return this.client.post({
      path: ['locations', locationId, 'inactive'],
    });
  }

  async markPrimary(locationId: string): Promise<MarkAsPrimaryResponse> {
    return this.client.post({
      path: ['locations', locationId, 'markasprimary'],
    });
  }
}
