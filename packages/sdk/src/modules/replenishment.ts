import type {
  BulkUpdateReplenishmentConfigurationsRequest,
  BulkUpdateReplenishmentConfigurationsResponse,
  CreateReplenishmentConfigurationRequest,
  CreateReplenishmentConfigurationResponse,
  DismissReplenishmentTaskResponse,
  GenerateReplenishmentTaskResponse,
  GetReplenishmentConfigurationResponse,
  GetReplenishmentConfigurationsForAssociatedLocationsResponse,
  GetReplenishmentConfigurationsForAssociatedWarehousesResponse,
  GetReplenishmentOrderDetailsResponse,
  GetReplenishmentTaskDetailsReportResponse,
  GetReplenishmentTaskResponse,
  ListReplenishmentTasksResponse,
  PauseReplenishmentConfigurationResponse,
  ResumeReplenishmentConfigurationResponse,
  UpdateReplenishmentConfigurationRequest,
  UpdateReplenishmentConfigurationResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Replenishment {
  constructor(private readonly http: HTTPClient) {}

  async getLocationConfigurations(
    itemId: string
  ): Promise<
    GetReplenishmentConfigurationsForAssociatedLocationsResponse['replenishment_configurations']
  > {
    const { replenishment_configurations } =
      await this.http.get<GetReplenishmentConfigurationsForAssociatedLocationsResponse>({
        path: ['items', itemId, 'locations', 'replenishments'],
      })
    return replenishment_configurations
  }

  async getWarehouseConfigurations(
    itemId: string
  ): Promise<
    GetReplenishmentConfigurationsForAssociatedWarehousesResponse['replenishment_configurations']
  > {
    const { replenishment_configurations } =
      await this.http.get<GetReplenishmentConfigurationsForAssociatedWarehousesResponse>({
        path: ['items', itemId, 'warehouses', 'replenishments'],
      })
    return replenishment_configurations
  }

  async get(
    replenishmentConfigurationId: string
  ): Promise<GetReplenishmentConfigurationResponse['replenishment_configuration']> {
    const { replenishment_configuration } =
      await this.http.get<GetReplenishmentConfigurationResponse>({
        path: ['replenishments', replenishmentConfigurationId],
      })
    return replenishment_configuration
  }

  async update(
    replenishmentConfigurationId: string,
    data: UpdateReplenishmentConfigurationRequest
  ): Promise<UpdateReplenishmentConfigurationResponse['replenishment_configuration']> {
    const { replenishment_configuration } =
      await this.http.put<UpdateReplenishmentConfigurationResponse>({
        path: ['replenishments', replenishmentConfigurationId],
        body: data,
      })
    return replenishment_configuration
  }

  async bulkUpdate(
    itemIds: string,
    data: BulkUpdateReplenishmentConfigurationsRequest,
    locationIds?: string
  ): Promise<BulkUpdateReplenishmentConfigurationsResponse['replenishment_configurations']> {
    const { replenishment_configurations } =
      await this.http.put<BulkUpdateReplenishmentConfigurationsResponse>({
        path: ['replenishments'],
        query: { item_ids: itemIds, location_ids: locationIds },
        body: data,
      })
    return replenishment_configurations
  }

  async create(
    data: CreateReplenishmentConfigurationRequest
  ): Promise<CreateReplenishmentConfigurationResponse['replenishment_configuration']> {
    const { replenishment_configuration } =
      await this.http.post<CreateReplenishmentConfigurationResponse>({
        path: ['replenishments'],
        body: data,
      })
    return replenishment_configuration
  }

  async listTasks(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListReplenishmentTasksResponse['replenishment_tasks']> {
    const { replenishment_tasks } = await this.http.get<ListReplenishmentTasksResponse>({
      path: ['replenishments', 'tasks'],
      query: { ...params },
    })
    return replenishment_tasks
  }

  async getTask(taskId: string): Promise<GetReplenishmentTaskResponse['task_details']> {
    const { task_details } = await this.http.get<GetReplenishmentTaskResponse>({
      path: ['replenishments', 'tasks', taskId],
    })
    return task_details
  }

  async dismissTask(taskId: string): Promise<DismissReplenishmentTaskResponse> {
    return this.http.put<DismissReplenishmentTaskResponse>({
      path: ['replenishments', 'tasks', taskId, 'dismiss'],
    })
  }

  async getTaskForItem(itemId: string): Promise<GetReplenishmentTaskResponse['task_details']> {
    const { task_details } = await this.http.get<GetReplenishmentTaskResponse>({
      path: ['replenishments', 'tasks', 'details'],
      query: { item_id: itemId },
    })
    return task_details
  }

  async getOrderDetails(
    replenishmentConfigurationId: string,
    orderType: string
  ): Promise<GetReplenishmentOrderDetailsResponse['replenishment_order_details']> {
    const { replenishment_order_details } =
      await this.http.get<GetReplenishmentOrderDetailsResponse>({
        path: ['replenishments', 'orders'],
        query: {
          replenishment_configuration_id: replenishmentConfigurationId,
          order_type: orderType,
        },
      })
    return replenishment_order_details
  }

  async pause(
    replenishmentConfigurationId: string,
    pauseTillDate?: string
  ): Promise<PauseReplenishmentConfigurationResponse> {
    return this.http.put<PauseReplenishmentConfigurationResponse>({
      path: ['replenishments', replenishmentConfigurationId, 'pause'],
      query: { pause_till_date: pauseTillDate },
    })
  }

  async bulkPause(
    itemIds: string,
    locationIds?: string,
    pauseTillDate?: string
  ): Promise<PauseReplenishmentConfigurationResponse> {
    return this.http.put<PauseReplenishmentConfigurationResponse>({
      path: ['replenishments', 'pause'],
      query: { item_ids: itemIds, location_ids: locationIds, pause_till_date: pauseTillDate },
    })
  }

  async resume(
    replenishmentConfigurationId: string
  ): Promise<ResumeReplenishmentConfigurationResponse> {
    return this.http.put<ResumeReplenishmentConfigurationResponse>({
      path: ['replenishments', replenishmentConfigurationId, 'resume'],
    })
  }

  async bulkResume(
    itemIds: string,
    locationIds?: string
  ): Promise<ResumeReplenishmentConfigurationResponse> {
    return this.http.put<ResumeReplenishmentConfigurationResponse>({
      path: ['replenishments', 'resume'],
      query: { item_ids: itemIds, location_ids: locationIds },
    })
  }

  async bulkDismissTasks(replenishmentTaskIds: string): Promise<DismissReplenishmentTaskResponse> {
    return this.http.put<DismissReplenishmentTaskResponse>({
      path: ['replenishments', 'tasks', 'dismiss'],
      query: { replenishment_task_ids: replenishmentTaskIds },
    })
  }

  async generateTask(
    replenishmentConfigurationId: string
  ): Promise<GenerateReplenishmentTaskResponse> {
    return this.http.post<GenerateReplenishmentTaskResponse>({
      path: ['replenishments', replenishmentConfigurationId, 'tasks', 'generate'],
    })
  }

  async bulkGenerateTasks(
    itemIds: string,
    locationIds?: string
  ): Promise<GenerateReplenishmentTaskResponse> {
    return this.http.post<GenerateReplenishmentTaskResponse>({
      path: ['replenishments', 'tasks', 'generate'],
      query: { item_ids: itemIds, location_ids: locationIds },
    })
  }

  async getTasksReport(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<GetReplenishmentTaskDetailsReportResponse['replenishment_tasks']> {
    const { replenishment_tasks } = await this.http.get<GetReplenishmentTaskDetailsReportResponse>({
      path: ['reports', 'replenishments', 'tasks'],
      query: { ...params },
    })
    return replenishment_tasks
  }
}
