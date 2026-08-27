import type {
  AddTaskAttachmentResponse,
  AddTaskAttachmentQuery,
  AddTaskCommentRequest,
  AddTaskCommentResponse,
  AddTaskRequest,
  AddTaskResponse,
  DeleteTaskDocumentQuery,
  DeleteTasksQuery,
  GetTaskDocumentResponse,
  GetTaskDocumentQuery,
  GetTaskResponse,
  ListTaskCommentsResponse,
  ListTasksQuery,
  ListTasksResponse,
  UpdatePercentageTaskRequest,
  UpdatePercentageTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  UpdateTasksQuery,
  UpdateTasksResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Tasks {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListTasksQuery): Promise<ListTasksResponse['tasks']> {
    const { tasks } = await this.http.get<ListTasksResponse>({ path: ['tasks'], query: params })
    return tasks
  }

  async bulkUpdate(
    data: UpdateTaskRequest[],
    params: UpdateTasksQuery
  ): Promise<UpdateTasksResponse['tasks']> {
    const { tasks } = await this.http.put<UpdateTasksResponse>({
      path: ['tasks'],
      query: params,
      body: data,
    })
    return tasks
  }

  async create(data: AddTaskRequest): Promise<AddTaskResponse['task']> {
    const { task } = await this.http.post<AddTaskResponse>({ path: ['tasks'], body: data })
    return task
  }

  async bulkDelete(params: DeleteTasksQuery): Promise<void> {
    await this.http.delete({ path: ['tasks'], query: params })
  }

  async get(taskId: string): Promise<GetTaskResponse['task']> {
    const { task } = await this.http.get<GetTaskResponse>({ path: ['tasks', taskId] })
    return task
  }

  async update(taskId: string, data: UpdateTaskRequest): Promise<UpdateTaskResponse['task']> {
    const { task } = await this.http.put<UpdateTaskResponse>({
      path: ['tasks', taskId],
      body: data,
    })
    return task
  }

  async delete(taskId: string): Promise<void> {
    await this.http.delete({ path: ['tasks', taskId] })
  }

  async updatePercentage(
    taskId: string,
    data: UpdatePercentageTaskRequest
  ): Promise<UpdatePercentageTaskResponse['task']> {
    const { task } = await this.http.post<UpdatePercentageTaskResponse>({
      path: ['tasks', taskId, 'percentage'],
      body: data,
    })
    return task
  }

  async markAsOpen(taskId: string): Promise<void> {
    await this.http.post({ path: ['tasks', taskId, 'markasopen'] })
  }

  async markAsOngoing(taskId: string): Promise<void> {
    await this.http.post({ path: ['tasks', taskId, 'markasongoing'] })
  }

  async markAsCompleted(taskId: string): Promise<void> {
    await this.http.post({ path: ['tasks', taskId, 'markascompleted'] })
  }

  async listComments(taskId: string): Promise<ListTaskCommentsResponse['comments']> {
    const { comments } = await this.http.get<ListTaskCommentsResponse>({
      path: ['tasks', taskId, 'comments'],
    })
    return comments
  }

  async addComment(
    taskId: string,
    data: AddTaskCommentRequest
  ): Promise<AddTaskCommentResponse['comment']> {
    const { comment } = await this.http.post<AddTaskCommentResponse>({
      path: ['tasks', taskId, 'comments'],
      body: data,
    })
    return comment
  }

  async deleteComment(taskId: string, commentId: string): Promise<void> {
    await this.http.delete({ path: ['tasks', taskId, 'comments', commentId] })
  }

  async addAttachment(
    taskId: string,
    params?: AddTaskAttachmentQuery
  ): Promise<AddTaskAttachmentResponse['documents']> {
    const { documents } = await this.http.post<AddTaskAttachmentResponse>({
      path: ['tasks', taskId, 'attachment'],
      query: params,
    })
    return documents
  }

  async getDocument(
    taskId: string,
    documentId: string,
    params?: GetTaskDocumentQuery
  ): Promise<GetTaskDocumentResponse['documents']> {
    const { documents } = await this.http.get<GetTaskDocumentResponse>({
      path: ['tasks', taskId, 'documents', documentId],
      query: params,
    })
    return documents
  }

  async deleteDocument(
    taskId: string,
    documentId: string,
    params?: DeleteTaskDocumentQuery
  ): Promise<void> {
    await this.http.delete({
      path: ['tasks', taskId, 'documents', documentId],
      query: params,
    })
  }
}
