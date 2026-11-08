import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  GetOrganizationResponse,
  ListOrganizationsResponse,
  UpdateOrganizationRequest,
  UpdateOrganizationResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * An Organisation represents a company or an institution running a business.
 */
export function createOrganizations(http: HTTPClient) {
  return {
    async list(): Promise<ListOrganizationsResponse['organizations']> {
      const { organizations } = await http.get<ListOrganizationsResponse>({
        path: ['organizations'],
      })
      return organizations
    },

    async create(
      data: CreateOrganizationRequest
    ): Promise<CreateOrganizationResponse['organization']> {
      const { organization } = await http.post<CreateOrganizationResponse>({
        path: ['organizations'],
        body: data,
      })
      return organization
    },

    async get(organizationId: string): Promise<GetOrganizationResponse['organization']> {
      const { organization } = await http.get<GetOrganizationResponse>({
        path: ['organizations', organizationId],
      })
      return organization
    },

    async update(
      organizationId: string,
      data: UpdateOrganizationRequest
    ): Promise<UpdateOrganizationResponse['organization']> {
      const { organization } = await http.put<UpdateOrganizationResponse>({
        path: ['organizations', organizationId],
        body: data,
      })
      return organization
    },
  }
}

export type Organizations = ReturnType<typeof createOrganizations>
