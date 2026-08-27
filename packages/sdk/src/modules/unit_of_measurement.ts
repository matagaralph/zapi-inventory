import type {
  CreateUnitConversionRequest,
  CreateUnitConversionResponse,
  CreateUnitGroupRequest,
  CreateUnitGroupResponse,
  CreateUnitRequest,
  CreateUnitResponse,
  GetUnitGroupResponse,
  ListUnitConversionsResponse,
  ListUnitGroupsResponse,
  ListUnitsResponse,
  UpdateUnitConversionRequest,
  UpdateUnitConversionResponse,
  UpdateUnitGroupRequest,
  UpdateUnitGroupResponse,
  UpdateUnitRequest,
  UpdateUnitResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class UnitsOfMeasurement {
  constructor(private readonly http: HTTPClient) {}

  async listGroups(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListUnitGroupsResponse['unit_groups']> {
    const { unit_groups } = await this.http.get<ListUnitGroupsResponse>({
      path: ['unitgroups'],
      query: params,
    })
    return unit_groups
  }

  async createGroup(data: CreateUnitGroupRequest): Promise<CreateUnitGroupResponse['unit_group']> {
    const { unit_group } = await this.http.post<CreateUnitGroupResponse>({
      path: ['unitgroups'],
      body: data,
    })
    return unit_group
  }

  async getGroup(unitGroupId: string): Promise<GetUnitGroupResponse['unit_group']> {
    const { unit_group } = await this.http.get<GetUnitGroupResponse>({
      path: ['unitgroups', unitGroupId],
    })
    return unit_group
  }

  async updateGroup(
    unitGroupId: string,
    data: UpdateUnitGroupRequest
  ): Promise<UpdateUnitGroupResponse['unit_group']> {
    const { unit_group } = await this.http.put<UpdateUnitGroupResponse>({
      path: ['unitgroups', unitGroupId],
      body: data,
    })
    return unit_group
  }

  async deleteGroup(unitGroupId: string): Promise<void> {
    await this.http.delete({ path: ['unitgroups', unitGroupId] })
  }

  async listUnits(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListUnitsResponse['units']> {
    const { units } = await this.http.get<ListUnitsResponse>({
      path: ['units'],
      query: params,
    })
    return units
  }

  async createUnit(data: CreateUnitRequest): Promise<CreateUnitResponse['unit']> {
    const { unit } = await this.http.post<CreateUnitResponse>({ path: ['units'], body: data })
    return unit
  }

  async updateUnit(unitId: string, data: UpdateUnitRequest): Promise<UpdateUnitResponse['unit']> {
    const { unit } = await this.http.put<UpdateUnitResponse>({
      path: ['units', unitId],
      body: data,
    })
    return unit
  }

  async deleteUnit(unitId: string): Promise<void> {
    await this.http.delete({ path: ['units', unitId] })
  }

  async listConversions(unitId: string): Promise<ListUnitConversionsResponse['unit_conversions']> {
    const { unit_conversions } = await this.http.get<ListUnitConversionsResponse>({
      path: ['units', unitId, 'unitconversions'],
    })
    return unit_conversions
  }

  async createConversion(
    unitId: string,
    data: CreateUnitConversionRequest
  ): Promise<CreateUnitConversionResponse['unit_conversion']> {
    const { unit_conversion } = await this.http.post<CreateUnitConversionResponse>({
      path: ['units', unitId, 'unitconversions'],
      body: data,
    })
    return unit_conversion
  }

  async updateConversion(
    unitId: string,
    unitConversionId: string,
    data: UpdateUnitConversionRequest
  ): Promise<UpdateUnitConversionResponse['unit_conversion']> {
    const { unit_conversion } = await this.http.put<UpdateUnitConversionResponse>({
      path: ['units', unitId, 'unitconversions', unitConversionId],
      body: data,
    })
    return unit_conversion
  }

  async deleteConversion(unitId: string, unitConversionId: string): Promise<void> {
    await this.http.delete({ path: ['units', unitId, 'unitconversions', unitConversionId] })
  }
}
