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

export class Taxes {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListTaxesResponse['taxes']> {
    const { taxes } = await this.http.get<ListTaxesResponse>({
      path: ['settings', 'taxes'],
      query: { ...params },
    })
    return taxes
  }

  async create(data: CreateTaxRequest): Promise<CreateTaxResponse['tax']> {
    const { tax } = await this.http.post<CreateTaxResponse>({
      path: ['settings', 'taxes'],
      body: data,
    })
    return tax
  }

  async get(taxId: string): Promise<GetTaxResponse['tax']> {
    const { tax } = await this.http.get<GetTaxResponse>({ path: ['settings', 'taxes', taxId] })
    return tax
  }

  async update(taxId: string, data: UpdateTaxRequest): Promise<UpdateTaxResponse['tax']> {
    const { tax } = await this.http.put<UpdateTaxResponse>({
      path: ['settings', 'taxes', taxId],
      body: data,
    })
    return tax
  }

  async delete(taxId: string): Promise<void> {
    await this.http.delete({ path: ['settings', 'taxes', taxId] })
  }

  async getGroup(taxGroupId: string): Promise<GetTaxGroupResponse['tax_group']> {
    const { tax_group } = await this.http.get<GetTaxGroupResponse>({
      path: ['settings', 'taxgroups', taxGroupId],
    })
    return tax_group
  }

  async updateGroup(
    taxGroupId: string,
    data: UpdateTaxGroupRequest
  ): Promise<UpdateTaxGroupResponse['tax_group']> {
    const { tax_group } = await this.http.put<UpdateTaxGroupResponse>({
      path: ['settings', 'taxgroups', taxGroupId],
      body: data,
    })
    return tax_group
  }

  async deleteGroup(taxGroupId: string): Promise<void> {
    await this.http.delete({ path: ['settings', 'taxgroups', taxGroupId] })
  }

  async createGroup(data: CreateTaxGroupRequest): Promise<CreateTaxGroupResponse['tax_group']> {
    const { tax_group } = await this.http.post<CreateTaxGroupResponse>({
      path: ['settings', 'taxgroups'],
      body: data,
    })
    return tax_group
  }

  async listAuthorities(): Promise<ListTaxAuthoritiesUsEditionOnlyResponse['tax_authorities']> {
    const { tax_authorities } = await this.http.get<ListTaxAuthoritiesUsEditionOnlyResponse>({
      path: ['settings', 'taxauthorities'],
    })
    return tax_authorities
  }

  async createAuthority(
    data: CreateTaxAuthorityUsAndCaEditionOnlyRequest
  ): Promise<CreateTaxAuthorityUsAndCaEditionOnlyResponse['tax_authority']> {
    const { tax_authority } = await this.http.post<CreateTaxAuthorityUsAndCaEditionOnlyResponse>({
      path: ['settings', 'taxauthorities'],
      body: data,
    })
    return tax_authority
  }

  async getAuthority(
    taxAuthorityId: string
  ): Promise<GetTaxAuthorityUsAndCaEditionOnlyResponse['tax_authority']> {
    const { tax_authority } = await this.http.get<GetTaxAuthorityUsAndCaEditionOnlyResponse>({
      path: ['settings', 'taxauthorities', taxAuthorityId],
    })
    return tax_authority
  }

  async updateAuthority(
    taxAuthorityId: string,
    data: UpdateTaxAuthorityUsAndCaEditionOnlyRequest
  ): Promise<UpdateTaxAuthorityUsAndCaEditionOnlyResponse['tax_authority']> {
    const { tax_authority } = await this.http.put<UpdateTaxAuthorityUsAndCaEditionOnlyResponse>({
      path: ['settings', 'taxauthorities', taxAuthorityId],
      body: data,
    })
    return tax_authority
  }

  async deleteAuthority(taxAuthorityId: string): Promise<void> {
    await this.http.delete({ path: ['settings', 'taxauthorities', taxAuthorityId] })
  }

  async listExemptions(): Promise<ListTaxExemptionsUsEditionOnlyResponse['tax_exemptions']> {
    const { tax_exemptions } = await this.http.get<ListTaxExemptionsUsEditionOnlyResponse>({
      path: ['settings', 'taxexemptions'],
    })
    return tax_exemptions
  }

  async createExemption(
    data: CreateTaxExemptionUsEditionOnlyRequest
  ): Promise<CreateTaxExemptionUsEditionOnlyResponse['tax_exemption']> {
    const { tax_exemption } = await this.http.post<CreateTaxExemptionUsEditionOnlyResponse>({
      path: ['settings', 'taxexemptions'],
      body: data,
    })
    return tax_exemption
  }

  async getExemption(
    taxExemptionId: string
  ): Promise<GetTaxExemptionUsEditionOnlyResponse['tax_exemption']> {
    const { tax_exemption } = await this.http.get<GetTaxExemptionUsEditionOnlyResponse>({
      path: ['settings', 'taxexemptions', taxExemptionId],
    })
    return tax_exemption
  }

  async updateExemption(
    taxExemptionId: string,
    data: UpdateTaxExemptionUsEditionOnlyRequest
  ): Promise<UpdateTaxExemptionUsEditionOnlyResponse['tax_exemption']> {
    const { tax_exemption } = await this.http.put<UpdateTaxExemptionUsEditionOnlyResponse>({
      path: ['settings', 'taxexemptions', taxExemptionId],
      body: data,
    })
    return tax_exemption
  }

  async deleteExemption(taxExemptionId: string): Promise<void> {
    await this.http.delete({ path: ['settings', 'taxexemptions', taxExemptionId] })
  }
}
