import type { ApiClient } from '../client';
import type {
  CreateLocationRequest,
  CreateLocationResponse,
  ListAllLocationResponse,
  UpdateLocationRequest,
  UpdateLocationResponse,
} from '../types/location';

export class LocationModule {
  constructor(private client: ApiClient) {}

  enable(): Promise<void> {
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

  delete(locationId: string): Promise<void> {
    return this.client.delete({
      path: ['locations', locationId],
    });
  }

  markActive(locationId: string): Promise<void> {
    return this.client.post({
      path: ['locations', locationId, 'active'],
    });
  }

  markInactive(locationId: string): Promise<void> {
    return this.client.post({
      path: ['locations', locationId, 'inactive'],
    });
  }

  markPrimary(locationId: string): Promise<void> {
    return this.client.post({
      path: ['locations', locationId, 'markasprimary'],
    });
  }
}
