import type { HTTPClient } from '../http.ts'

export interface CountryOption {
  country_code: string
  mobile_code_label: string
  mobile_code: string
  name: string
  id: string
  text: string
  is_eu_country: boolean
  country_id: number
  search_text: string
}

export interface ReportMetadata {
  page: number
  per_page: number
  total: string
  total_pages: number
  report_name: string
  applied_filter: string
  sort_column: string
  sort_order: string
}

/**
 * Internal, undocumented Zoho endpoints that back Zoho's own web app but are not part of the
 * published Inventory API. Everything on this class is experimental: it can change shape or
 * stop working without notice, and none of it is covered by Zoho's API stability guarantees.
 */
export class Internal {
  constructor(private readonly http: HTTPClient) {}

  /**
   * Lists countries with their dialing codes, as used to populate phone country pickers in
   * Zoho's own UI.
   *
   * @experimental This calls an internal, undocumented Zoho endpoint.
   * @param languagecode - Language to localize country names into. Defaults to `en`.
   */
  async getCountries(languagecode = 'en'): Promise<CountryOption[]> {
    const { results } = await this.http.get<{ results: CountryOption[] }>({
      path: ['meta', 'countries'],
      query: { languagecode },
    })
    return results
  }

  /**
   * Retrieves report-level metadata for a paginated resource, including pagination details and
   * report context (name, filter, sort order).
   *
   * @experimental This calls an internal, undocumented Zoho endpoint.
   * @param path - The API path segments for the target resource.
   * @param params - Optional query parameters to include in the request.
   * @returns The report metadata extracted from the response's `page_context`.
   */
  async getReportMetadata(
    path: string[],
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ReportMetadata> {
    const response = await this.http.get<{ page_context: ReportMetadata }>({
      path,
      query: {
        ...params,
        response_option: 2,
      },
    })

    return response.page_context
  }
}
