import type {
  BulkUpdateReplenishmentConfigurationsRequest,
  BulkUpdateReplenishmentConfigurationsResponse,
  BulkDismissReplenishmentTasksQuery,
  BulkGenerateReplenishmentTasksQuery,
  BulkPauseReplenishmentsQuery,
  BulkResumeReplenishmentsQuery,
  BulkUpdateReplenishmentsQuery,
  CreateReplenishmentConfigurationRequest,
  CreateReplenishmentConfigurationResponse,
  DismissReplenishmentTaskResponse,
  GenerateReplenishmentTaskResponse,
  GetReplenishmentConfigurationResponse,
  GetReplenishmentConfigurationsForAssociatedLocationsResponse,
  GetReplenishmentConfigurationsForAssociatedWarehousesResponse,
  GetReplenishmentOrderDetailsResponse,
  GetReplenishmentOrderDetailsQuery,
  GetReplenishmentTaskDetailsReportResponse,
  GetReplenishmentTaskResponse,
  GetReplenishmentTaskForItemQuery,
  GetReplenishmentTasksReportQuery,
  ListReplenishmentTasksResponse,
  ListReplenishmentTasksQuery,
  PauseReplenishmentConfigurationResponse,
  PauseReplenishmentConfigurationQuery,
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
    data: BulkUpdateReplenishmentConfigurationsRequest,
    params: BulkUpdateReplenishmentsQuery
  ): Promise<BulkUpdateReplenishmentConfigurationsResponse['replenishment_configurations']> {
    const { replenishment_configurations } =
      await this.http.put<BulkUpdateReplenishmentConfigurationsResponse>({
        path: ['replenishments'],
        query: params,
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
    params?: ListReplenishmentTasksQuery
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

  async getTaskForItem(
    params: GetReplenishmentTaskForItemQuery
  ): Promise<GetReplenishmentTaskResponse['task_details']> {
    const { task_details } = await this.http.get<GetReplenishmentTaskResponse>({
      path: ['replenishments', 'tasks', 'details'],
      query: params,
    })
    return task_details
  }

  async getOrderDetails(
    params: GetReplenishmentOrderDetailsQuery
  ): Promise<GetReplenishmentOrderDetailsResponse['replenishment_order_details']> {
    const { replenishment_order_details } =
      await this.http.get<GetReplenishmentOrderDetailsResponse>({
        path: ['replenishments', 'orders'],
        query: params,
      })
    return replenishment_order_details
  }

  async pause(
    replenishmentConfigurationId: string,
    params?: PauseReplenishmentConfigurationQuery
  ): Promise<PauseReplenishmentConfigurationResponse> {
    return this.http.put<PauseReplenishmentConfigurationResponse>({
      path: ['replenishments', replenishmentConfigurationId, 'pause'],
      query: params,
    })
  }

  async bulkPause(
    params: BulkPauseReplenishmentsQuery
  ): Promise<PauseReplenishmentConfigurationResponse> {
    return this.http.put<PauseReplenishmentConfigurationResponse>({
      path: ['replenishments', 'pause'],
      query: params,
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
    params: BulkResumeReplenishmentsQuery
  ): Promise<ResumeReplenishmentConfigurationResponse> {
    return this.http.put<ResumeReplenishmentConfigurationResponse>({
      path: ['replenishments', 'resume'],
      query: params,
    })
  }

  async bulkDismissTasks(
    params: BulkDismissReplenishmentTasksQuery
  ): Promise<DismissReplenishmentTaskResponse> {
    return this.http.put<DismissReplenishmentTaskResponse>({
      path: ['replenishments', 'tasks', 'dismiss'],
      query: params,
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
    params: BulkGenerateReplenishmentTasksQuery
  ): Promise<GenerateReplenishmentTaskResponse> {
    return this.http.post<GenerateReplenishmentTaskResponse>({
      path: ['replenishments', 'tasks', 'generate'],
      query: params,
    })
  }

  async getTasksReport(
    params?: GetReplenishmentTasksReportQuery
  ): Promise<GetReplenishmentTaskDetailsReportResponse['replenishment_tasks']> {
    const { replenishment_tasks } = await this.http.get<GetReplenishmentTaskDetailsReportResponse>({
      path: ['reports', 'replenishments', 'tasks'],
      query: { ...params },
    })
    return replenishment_tasks
  }
}
