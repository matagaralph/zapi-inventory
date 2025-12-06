import type { ApiClient } from '../client';
import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  ListOrganizationsResponse,
  UpdateOrganizationRequest,
  UpdateOrganizationResponse,
  GetOrganizationResponse,
} from '../types/organization';

export class OrganizationModule {
  constructor(private client: ApiClient) {}

  async list(opts?: {
    limit: number;
  }): Promise<ListOrganizationsResponse['organizations']> {
    return this.client.getList({
      limit: opts?.limit,
      path: ['organizations'],
      extractor: (res: ListOrganizationsResponse) => res.organizations ?? [],
    });
  }

  async create(
    organization: CreateOrganizationRequest
  ): Promise<CreateOrganizationResponse['organization']> {
    const res = await this.client.post<CreateOrganizationResponse>({
      path: ['organizations'],
      body: organization,
    });
    return res.organization;
  }

  async get(
    organizationId: string
  ): Promise<GetOrganizationResponse['organization']> {
    const res = await this.client.get<GetOrganizationResponse>({
      path: ['organizations', organizationId],
    });
    return res.organization;
  }

  async update(
    organizationId: string,
    organization: UpdateOrganizationRequest
  ): Promise<UpdateOrganizationResponse['organization']> {
    const res = await this.client.put<UpdateOrganizationResponse>({
      path: ['organizations', organizationId],
      body: organization,
    });
    return res.organization;
  }
}
