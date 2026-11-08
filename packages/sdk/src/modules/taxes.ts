import type {
  CreateTaxAuthorityUsAndCaEditionOnlyRequest,
  CreateTaxAuthorityUsAndCaEditionOnlyResponse,
  CreateTaxExemptionUsEditionOnlyRequest,
  CreateTaxExemptionUsEditionOnlyResponse,
  CreateTaxGroupRequest,
  CreateTaxGroupResponse,
  CreateTaxRequest,
  CreateTaxResponse,
  GetTaxAuthorityUsAndCaEditionOnlyResponse,
  GetTaxExemptionUsEditionOnlyResponse,
  GetTaxGroupResponse,
  GetTaxResponse,
  ListTaxAuthoritiesUsEditionOnlyResponse,
  ListTaxesQuery,
  ListTaxesResponse,
  ListTaxExemptionsUsEditionOnlyResponse,
  UpdateTaxAuthorityUsAndCaEditionOnlyRequest,
  UpdateTaxAuthorityUsAndCaEditionOnlyResponse,
  UpdateTaxExemptionUsEditionOnlyRequest,
  UpdateTaxExemptionUsEditionOnlyResponse,
  UpdateTaxGroupRequest,
  UpdateTaxGroupResponse,
  UpdateTaxRequest,
  UpdateTaxResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * Taxes are collected by the government to manage state expenses. A company and an individual must pay multiple taxes and disclose the income details.
 */
export function createTaxes(http: HTTPClient) {
  return {
    async list(params?: ListTaxesQuery): Promise<ListTaxesResponse['taxes']> {
      const { taxes } = await http.get<ListTaxesResponse>({
        path: ['settings', 'taxes'],
        query: { ...params },
      })
      return taxes
    },

    async create(data: CreateTaxRequest): Promise<CreateTaxResponse['tax']> {
      const { tax } = await http.post<CreateTaxResponse>({
        path: ['settings', 'taxes'],
        body: data,
      })
      return tax
    },

    async get(taxId: string): Promise<GetTaxResponse['tax']> {
      const { tax } = await http.get<GetTaxResponse>({ path: ['settings', 'taxes', taxId] })
      return tax
    },

    async update(taxId: string, data: UpdateTaxRequest): Promise<UpdateTaxResponse['tax']> {
      const { tax } = await http.put<UpdateTaxResponse>({
        path: ['settings', 'taxes', taxId],
        body: data,
      })
      return tax
    },

    async delete(taxId: string): Promise<void> {
      await http.delete({ path: ['settings', 'taxes', taxId] })
    },

    async getGroup(taxGroupId: string): Promise<GetTaxGroupResponse['tax_group']> {
      const { tax_group } = await http.get<GetTaxGroupResponse>({
        path: ['settings', 'taxgroups', taxGroupId],
      })
      return tax_group
    },

    async updateGroup(
      taxGroupId: string,
      data: UpdateTaxGroupRequest
    ): Promise<UpdateTaxGroupResponse['tax_group']> {
      const { tax_group } = await http.put<UpdateTaxGroupResponse>({
        path: ['settings', 'taxgroups', taxGroupId],
        body: data,
      })
      return tax_group
    },

    async deleteGroup(taxGroupId: string): Promise<void> {
      await http.delete({ path: ['settings', 'taxgroups', taxGroupId] })
    },

    async createGroup(data: CreateTaxGroupRequest): Promise<CreateTaxGroupResponse['tax_group']> {
      const { tax_group } = await http.post<CreateTaxGroupResponse>({
        path: ['settings', 'taxgroups'],
        body: data,
      })
      return tax_group
    },

    async listAuthorities(): Promise<ListTaxAuthoritiesUsEditionOnlyResponse['tax_authorities']> {
      const { tax_authorities } = await http.get<ListTaxAuthoritiesUsEditionOnlyResponse>({
        path: ['settings', 'taxauthorities'],
      })
      return tax_authorities
    },

    async createAuthority(
      data: CreateTaxAuthorityUsAndCaEditionOnlyRequest
    ): Promise<CreateTaxAuthorityUsAndCaEditionOnlyResponse['tax_authority']> {
      const { tax_authority } = await http.post<CreateTaxAuthorityUsAndCaEditionOnlyResponse>({
        path: ['settings', 'taxauthorities'],
        body: data,
      })
      return tax_authority
    },

    async getAuthority(
      taxAuthorityId: string
    ): Promise<GetTaxAuthorityUsAndCaEditionOnlyResponse['tax_authority']> {
      const { tax_authority } = await http.get<GetTaxAuthorityUsAndCaEditionOnlyResponse>({
        path: ['settings', 'taxauthorities', taxAuthorityId],
      })
      return tax_authority
    },

    async updateAuthority(
      taxAuthorityId: string,
      data: UpdateTaxAuthorityUsAndCaEditionOnlyRequest
    ): Promise<UpdateTaxAuthorityUsAndCaEditionOnlyResponse['tax_authority']> {
      const { tax_authority } = await http.put<UpdateTaxAuthorityUsAndCaEditionOnlyResponse>({
        path: ['settings', 'taxauthorities', taxAuthorityId],
        body: data,
      })
      return tax_authority
    },

    async deleteAuthority(taxAuthorityId: string): Promise<void> {
      await http.delete({ path: ['settings', 'taxauthorities', taxAuthorityId] })
    },

    async listExemptions(): Promise<ListTaxExemptionsUsEditionOnlyResponse['tax_exemptions']> {
      const { tax_exemptions } = await http.get<ListTaxExemptionsUsEditionOnlyResponse>({
        path: ['settings', 'taxexemptions'],
      })
      return tax_exemptions
    },

    async createExemption(
      data: CreateTaxExemptionUsEditionOnlyRequest
    ): Promise<CreateTaxExemptionUsEditionOnlyResponse['tax_exemption']> {
      const { tax_exemption } = await http.post<CreateTaxExemptionUsEditionOnlyResponse>({
        path: ['settings', 'taxexemptions'],
        body: data,
      })
      return tax_exemption
    },

    async getExemption(
      taxExemptionId: string
    ): Promise<GetTaxExemptionUsEditionOnlyResponse['tax_exemption']> {
      const { tax_exemption } = await http.get<GetTaxExemptionUsEditionOnlyResponse>({
        path: ['settings', 'taxexemptions', taxExemptionId],
      })
      return tax_exemption
    },

    async updateExemption(
      taxExemptionId: string,
      data: UpdateTaxExemptionUsEditionOnlyRequest
    ): Promise<UpdateTaxExemptionUsEditionOnlyResponse['tax_exemption']> {
      const { tax_exemption } = await http.put<UpdateTaxExemptionUsEditionOnlyResponse>({
        path: ['settings', 'taxexemptions', taxExemptionId],
        body: data,
      })
      return tax_exemption
    },

    async deleteExemption(taxExemptionId: string): Promise<void> {
      await http.delete({ path: ['settings', 'taxexemptions', taxExemptionId] })
    },
  }
}

export type Taxes = ReturnType<typeof createTaxes>
