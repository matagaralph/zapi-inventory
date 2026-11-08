import type {
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
export interface ReportingTagSummary {
  tag_id?: string
  tag_name?: string
  tag_order?: number
  description?: string
  is_active?: boolean
  is_mandatory?: boolean
  is_class?: boolean
  is_draft?: boolean
}

export interface ActionResponse {
  message?: string
}

export interface ReorderTagsResponse {
  code?: number
  message?: string
  tags?: ReportingTagSummary[]
}

/**
 * Reporting tags are custom financial labels you add to financial transactions to categorize them  by department, cost center, business unit, or any other way based on business needs for reporting. In this document,  you'll learn how to create and manage reporting tags for the specific requirements that your organization needs.
 */
export function createReportingTags(http: HTTPClient) {
  return {
    async list(): Promise<ReportingTagSummary[] | undefined> {
      const { reporting_tags } = await http.get<{ reporting_tags?: ReportingTagSummary[] }>({
        path: ['reportingtags'],
      })
      return reporting_tags
    },

    async create(data: UpdateReportingTagRequest): Promise<ReportingTagsResponse['tag']> {
      const { tag } = await http.post<ReportingTagsResponse>({
        path: ['reportingtags'],
        body: data,
      })
      return tag
    },

    async update(
      tagId: string,
      data: UpdateReportingTagRequest
    ): Promise<ReportingTagsResponse['tag']> {
      const { tag } = await http.put<ReportingTagsResponse>({
        path: ['reportingtags', tagId],
        body: data,
      })
      return tag
    },

    async markDefaultOption(tagId: string, params: MarkDefaultOptionQuery): Promise<void> {
      await http.post({
        path: ['reportingtags', tagId],
        query: params,
      })
    },

    async delete(tagId: string): Promise<void> {
      await http.delete({ path: ['reportingtags', tagId] })
    },

    async updateOptions(tagId: string, data: UpdateOptionsRequest): Promise<UpdateOptionsResponse> {
      return http.put<UpdateOptionsResponse>({
        path: ['reportingtags', tagId, 'options'],
        body: data,
      })
    },

    async updateCriteria(
      tagId: string,
      data: UpdateCriteriaRequest
    ): Promise<UpdateCriteriaResponse> {
      return http.put<UpdateCriteriaResponse>({
        path: ['reportingtags', tagId, 'criteria'],
        body: data,
      })
    },

    async activate(tagId: string): Promise<ActionResponse> {
      return http.post<ActionResponse>({ path: ['reportingtags', tagId, 'active'] })
    },

    async deactivate(tagId: string): Promise<ActionResponse> {
      return http.post<ActionResponse>({ path: ['reportingtags', tagId, 'inactive'] })
    },

    async activateOption(tagId: string, optionId: string): Promise<ActionResponse> {
      return http.post<ActionResponse>({
        path: ['reportingtags', tagId, 'option', optionId, 'active'],
      })
    },

    async deactivateOption(tagId: string, optionId: string): Promise<ActionResponse> {
      return http.post<ActionResponse>({
        path: ['reportingtags', tagId, 'option', optionId, 'inactive'],
      })
    },

    async getOptionsDetailPage(params: GetTagOptionsQuery): Promise<OptionsDetailPageResponse> {
      return http.get<OptionsDetailPageResponse>({
        path: ['reportingtags', 'options'],
        query: params,
      })
    },

    async listAllOptions(params: TagOptionsQuery): Promise<OptionsResponse> {
      return http.get<OptionsResponse>({
        path: ['reportingtags', 'options', 'all'],
        query: params,
      })
    },

    async reorder(tagIds: string[]): Promise<ReorderTagsResponse> {
      return http.put<ReorderTagsResponse>({
        path: ['reportingtags', 'reorder'],
        body: { tag_ids: tagIds },
      })
    },
  }
}

export type ReportingTags = ReturnType<typeof createReportingTags>
