import type { ApiClient } from '../client';
import type {
  // Taxes
  ListTaxesResponse,
  CreateTaxRequest,
  CreateTaxResponse,
  TaxResponse,
  UpdateTaxRequest,
  UpdateTaxResponse,
  // Groups
  CreateTaxGroupRequest,
  CreateTaxGroupResponse,
  GetTaxGroupResponse,
  UpdateTaxGroupRequest,
  UpdateTaxGroupResponse,
  // Authorities
  ListTaxAuthoritiesUsEditionOnlyResponse,
  CreateTaxAuthorityUsAndCaEditionOnlyRequest,
  CreateTaxAuthorityUsAndCaEditionOnlyResponse,
  GetTaxAuthorityUsAndCaEditionOnlyResponse,
  UpdateTaxAuthorityUsAndCaEditionOnlyRequest,
  UpdateTaxAuthorityUsAndCaEditionOnlyResponse,
  // Exemptions
  ListTaxExemptionsUsEditionOnlyResponse,
  CreateTaxExemptionUsEditionOnlyRequest,
  CreateTaxExemptionUsEditionOnlyResponse,
  GetTaxExemptionUsEditionOnlyResponse,
  UpdateTaxExemptionUsEditionOnlyRequest,
  UpdateTaxExemptionUsEditionOnlyResponse,
} from '../types/tax';

export class TaxModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * List taxes (includes simple and compound taxes).
   */
  async list(opts?: { limit?: number }): Promise<ListTaxesResponse['taxes']> {
    return this.client.getList({
      path: ['settings', 'taxes'],
      limit: opts?.limit,
      extractor: (res: ListTaxesResponse) => res.taxes ?? [],
    });
  }

  async create(tax: CreateTaxRequest): Promise<CreateTaxResponse['tax']> {
    const res = await this.client.post<CreateTaxResponse>({
      path: ['settings', 'taxes'],
      body: tax,
    });
    return res.tax;
  }

  async get(taxId: string): Promise<TaxResponse> {
    const res = await this.client.get<{ tax: TaxResponse }>({
      path: ['settings', 'taxes', taxId],
    });
    return res.tax;
  }

  async update(
    taxId: string,
    tax: UpdateTaxRequest
  ): Promise<UpdateTaxResponse['tax']> {
    const res = await this.client.put<UpdateTaxResponse>({
      path: ['settings', 'taxes', taxId],
      body: tax,
    });
    return res.tax;
  }

  delete(taxId: string): Promise<void> {
    return this.client.delete({
      path: ['settings', 'taxes', taxId],
    });
  }

  async createTaxGroup(
    taxGroup: CreateTaxGroupRequest
  ): Promise<CreateTaxGroupResponse['tax_group']> {
    const res = await this.client.post<CreateTaxGroupResponse>({
      path: ['settings', 'taxgroups'],
      body: taxGroup,
    });
    return res.tax_group;
  }

  async getTaxGroup(
    taxGroupId: string
  ): Promise<GetTaxGroupResponse['tax_group']> {
    const res = await this.client.get<GetTaxGroupResponse>({
      path: ['settings', 'taxgroups', taxGroupId],
    });
    return res.tax_group;
  }

  async updateTaxGroup(
    taxGroupId: string,
    taxGroup: UpdateTaxGroupRequest
  ): Promise<UpdateTaxGroupResponse['tax_group']> {
    const res = await this.client.put<UpdateTaxGroupResponse>({
      path: ['settings', 'taxgroups', taxGroupId],
      body: taxGroup,
    });
    return res.tax_group;
  }

  deleteTaxGroup(taxGroupId: string): Promise<void> {
    return this.client.delete({
      path: ['settings', 'taxgroups', taxGroupId],
    });
  }

  async listTaxAuthorities(opts?: {
    limit?: number;
  }): Promise<ListTaxAuthoritiesUsEditionOnlyResponse['tax_authorities']> {
    return this.client.getList({
      path: ['settings', 'taxauthorities'],
      limit: opts?.limit,
      extractor: (res: ListTaxAuthoritiesUsEditionOnlyResponse) =>
        res.tax_authorities ?? [],
    });
  }

  async createTaxAuthority(
    authority: CreateTaxAuthorityUsAndCaEditionOnlyRequest
  ): Promise<CreateTaxAuthorityUsAndCaEditionOnlyResponse['tax_authority']> {
    const res =
      await this.client.post<CreateTaxAuthorityUsAndCaEditionOnlyResponse>({
        path: ['settings', 'taxauthorities'],
        body: authority,
      });
    return res.tax_authority;
  }

  async getTaxAuthority(
    authorityId: string
  ): Promise<GetTaxAuthorityUsAndCaEditionOnlyResponse['tax_authority']> {
    const res =
      await this.client.get<GetTaxAuthorityUsAndCaEditionOnlyResponse>({
        path: ['settings', 'taxauthorities', authorityId],
      });
    return res.tax_authority;
  }

  async updateTaxAuthority(
    authorityId: string,
    authority: UpdateTaxAuthorityUsAndCaEditionOnlyRequest
  ): Promise<UpdateTaxAuthorityUsAndCaEditionOnlyResponse['tax_authority']> {
    const res =
      await this.client.put<UpdateTaxAuthorityUsAndCaEditionOnlyResponse>({
        path: ['settings', 'taxauthorities', authorityId],
        body: authority,
      });
    return res.tax_authority;
  }

  deleteTaxAuthority(authorityId: string): Promise<void> {
    return this.client.delete({
      path: ['settings', 'taxauthorities', authorityId],
    });
  }

  async listTaxExemptions(opts?: {
    limit?: number;
  }): Promise<ListTaxExemptionsUsEditionOnlyResponse['tax_exemptions']> {
    return this.client.getList({
      path: ['settings', 'taxexemptions'],
      limit: opts?.limit,
      extractor: (res: ListTaxExemptionsUsEditionOnlyResponse) =>
        res.tax_exemptions ?? [],
    });
  }

  async createTaxExemption(
    exemption: CreateTaxExemptionUsEditionOnlyRequest
  ): Promise<CreateTaxExemptionUsEditionOnlyResponse['tax_exemption']> {
    const res = await this.client.post<CreateTaxExemptionUsEditionOnlyResponse>(
      {
        path: ['settings', 'taxexemptions'],
        body: exemption,
      }
    );
    return res.tax_exemption;
  }

  async getTaxExemption(
    exemptionId: string
  ): Promise<GetTaxExemptionUsEditionOnlyResponse['tax_exemption']> {
    const res = await this.client.get<GetTaxExemptionUsEditionOnlyResponse>({
      path: ['settings', 'taxexemptions', exemptionId],
    });
    return res.tax_exemption;
  }

  async updateTaxExemption(
    exemptionId: string,
    exemption: UpdateTaxExemptionUsEditionOnlyRequest
  ): Promise<UpdateTaxExemptionUsEditionOnlyResponse['tax_exemption']> {
    const res = await this.client.put<UpdateTaxExemptionUsEditionOnlyResponse>({
      path: ['settings', 'taxexemptions', exemptionId],
      body: exemption,
    });
    return res.tax_exemption;
  }

  deleteTaxExemption(exemptionId: string): Promise<void> {
    return this.client.delete({
      path: ['settings', 'taxexemptions', exemptionId],
    });
  }
}
