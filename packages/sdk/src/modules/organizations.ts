import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  GetOrganizationResponse,
  ListOrganizationsResponse,
  UpdateOrganizationRequest,
  UpdateOrganizationResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Organizations {
  constructor(private readonly http: HTTPClient) {}

  async list(): Promise<ListOrganizationsResponse['organizations']> {
    const { organizations } = await this.http.get<ListOrganizationsResponse>({
      path: ['organizations'],
    })
    return organizations
  }

  async create(
    data: CreateOrganizationRequest
  ): Promise<CreateOrganizationResponse['organization']> {
    const { organization } = await this.http.post<CreateOrganizationResponse>({
      path: ['organizations'],
      body: data,
    })
    return organization
  }

  async get(organizationId: string): Promise<GetOrganizationResponse['organization']> {
    const { organization } = await this.http.get<GetOrganizationResponse>({
      path: ['organizations', organizationId],
    })
    return organization
  }

  async update(
    organizationId: string,
    data: UpdateOrganizationRequest
  ): Promise<UpdateOrganizationResponse['organization']> {
    const { organization } = await this.http.put<UpdateOrganizationResponse>({
      path: ['organizations', organizationId],
      body: data,
    })
    return organization
  }
}
