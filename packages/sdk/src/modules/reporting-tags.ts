import type {
  MarkDefaultOptionResponse,
  MarkDefaultOptionQuery,
  OptionsDetailPageResponse,
  OptionsResponse,
  ReportingTagsResponse,
  GetTagOptionsQuery,
  TagOptionsQuery,
  UpdateCriteriaRequest,
  UpdateCriteriaResponse,
  UpdateOptionsRequest,
  UpdateOptionsResponse,
  UpdateReportingTagRequest,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

// no named schema for this in Zoho's OpenAPI export, so it's declared locally
interface ReportingTagSummary {
  tag_id?: string
  tag_name?: string
  tag_order?: number
  description?: string
  is_active?: boolean
  is_mandatory?: boolean
  is_class?: boolean
  is_draft?: boolean
}

interface ActionResponse {
  message?: string
}

interface ReorderTagsResponse {
  code?: number
  message?: string
  tags?: ReportingTagSummary[]
}

export class ReportingTags {
  constructor(private readonly http: HTTPClient) {}

  async list(): Promise<ReportingTagSummary[] | undefined> {
    const { reporting_tags } = await this.http.get<{ reporting_tags?: ReportingTagSummary[] }>({
      path: ['reportingtags'],
    })
    return reporting_tags
  }

  async create(data: UpdateReportingTagRequest): Promise<ReportingTagsResponse['tag']> {
    const { tag } = await this.http.post<ReportingTagsResponse>({
      path: ['reportingtags'],
      body: data,
    })
    return tag
  }

  async update(
    tagId: string,
    data: UpdateReportingTagRequest
  ): Promise<ReportingTagsResponse['tag']> {
    const { tag } = await this.http.put<ReportingTagsResponse>({
      path: ['reportingtags', tagId],
      body: data,
    })
    return tag
  }

  async markDefaultOption(
    tagId: string,
    params: MarkDefaultOptionQuery
  ): Promise<MarkDefaultOptionResponse> {
    return this.http.post<MarkDefaultOptionResponse>({
      path: ['reportingtags', tagId],
      query: params,
    })
  }

  async delete(tagId: string): Promise<void> {
    await this.http.delete({ path: ['reportingtags', tagId] })
  }

  async updateOptions(tagId: string, data: UpdateOptionsRequest): Promise<UpdateOptionsResponse> {
    return this.http.put<UpdateOptionsResponse>({
      path: ['reportingtags', tagId, 'options'],
      body: data,
    })
  }

  async updateCriteria(
    tagId: string,
    data: UpdateCriteriaRequest
  ): Promise<UpdateCriteriaResponse> {
    return this.http.put<UpdateCriteriaResponse>({
      path: ['reportingtags', tagId, 'criteria'],
      body: data,
    })
  }

  async activate(tagId: string): Promise<ActionResponse> {
    return this.http.post<ActionResponse>({ path: ['reportingtags', tagId, 'active'] })
  }

  async deactivate(tagId: string): Promise<ActionResponse> {
    return this.http.post<ActionResponse>({ path: ['reportingtags', tagId, 'inactive'] })
  }

  async activateOption(tagId: string, optionId: string): Promise<ActionResponse> {
    return this.http.post<ActionResponse>({
      path: ['reportingtags', tagId, 'option', optionId, 'active'],
    })
  }

  async deactivateOption(tagId: string, optionId: string): Promise<ActionResponse> {
    return this.http.post<ActionResponse>({
      path: ['reportingtags', tagId, 'option', optionId, 'inactive'],
    })
  }

  async getOptionsDetailPage(params: GetTagOptionsQuery): Promise<OptionsDetailPageResponse> {
    return this.http.get<OptionsDetailPageResponse>({
      path: ['reportingtags', 'options'],
      query: params,
    })
  }

  async listAllOptions(params: TagOptionsQuery): Promise<OptionsResponse> {
    return this.http.get<OptionsResponse>({
      path: ['reportingtags', 'options', 'all'],
      query: params,
    })
  }

  async reorder(tagIds: string[]): Promise<ReorderTagsResponse> {
    return this.http.put<ReorderTagsResponse>({
      path: ['reportingtags', 'reorder'],
      body: { tag_ids: tagIds },
    })
  }
}
