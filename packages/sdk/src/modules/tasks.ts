import type {
  AddTaskAttachmentResponse,
  AddTaskCommentRequest,
  AddTaskCommentResponse,
  AddTaskRequest,
  AddTaskResponse,
  DeleteTaskDocumentQuery,
  DeleteTasksQuery,
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

/**
 * Tasks are the to-dos that you and your users have to complete. You can set reminders for tasks that need your attention. Reminders help you stay organized by alerting you about due or upcoming tasks.
 */
export function createTasks(http: HTTPClient) {
  return {
    async list(params?: ListTasksQuery): Promise<ListTasksResponse['tasks']> {
      const { tasks } = await http.get<ListTasksResponse>({ path: ['tasks'], query: params })
      return tasks
    },

    async bulkUpdate(
      data: UpdateTaskRequest[],
      params: UpdateTasksQuery
    ): Promise<UpdateTasksResponse['tasks']> {
      const { tasks } = await http.put<UpdateTasksResponse>({
        path: ['tasks'],
        query: params,
        body: data,
      })
      return tasks
    },

    async create(data: AddTaskRequest): Promise<AddTaskResponse['task']> {
      const { task } = await http.post<AddTaskResponse>({ path: ['tasks'], body: data })
      return task
    },

    async bulkDelete(params: DeleteTasksQuery): Promise<void> {
      await http.delete({ path: ['tasks'], query: params })
    },

    async get(taskId: string): Promise<GetTaskResponse['task']> {
      const { task } = await http.get<GetTaskResponse>({ path: ['tasks', taskId] })
      return task
    },

    async update(taskId: string, data: UpdateTaskRequest): Promise<UpdateTaskResponse['task']> {
      const { task } = await http.put<UpdateTaskResponse>({
        path: ['tasks', taskId],
        body: data,
      })
      return task
    },

    async delete(taskId: string): Promise<void> {
      await http.delete({ path: ['tasks', taskId] })
    },

    async updatePercentage(
      taskId: string,
      data: UpdatePercentageTaskRequest
    ): Promise<UpdatePercentageTaskResponse['task']> {
      const { task } = await http.post<UpdatePercentageTaskResponse>({
        path: ['tasks', taskId, 'percentage'],
        body: data,
      })
      return task
    },

    async markAsOpen(taskId: string): Promise<void> {
      await http.post({ path: ['tasks', taskId, 'markasopen'] })
    },

    async markAsOngoing(taskId: string): Promise<void> {
      await http.post({ path: ['tasks', taskId, 'markasongoing'] })
    },

    async markAsCompleted(taskId: string): Promise<void> {
      await http.post({ path: ['tasks', taskId, 'markascompleted'] })
    },

    async listComments(taskId: string): Promise<ListTaskCommentsResponse['comments']> {
      const { comments } = await http.get<ListTaskCommentsResponse>({
        path: ['tasks', taskId, 'comments'],
      })
      return comments
    },

    async addComment(
      taskId: string,
      data: AddTaskCommentRequest
    ): Promise<AddTaskCommentResponse['comment']> {
      const { comment } = await http.post<AddTaskCommentResponse>({
        path: ['tasks', taskId, 'comments'],
        body: data,
      })
      return comment
    },

    async deleteComment(taskId: string, commentId: string): Promise<void> {
      await http.delete({ path: ['tasks', taskId, 'comments', commentId] })
    },

    async addAttachment(
      taskId: string,
      attachment: Blob
    ): Promise<AddTaskAttachmentResponse['documents']> {
      const body = new FormData()
      body.append('attachment', attachment)
      const { documents } = await http.post<AddTaskAttachmentResponse>({
        path: ['tasks', taskId, 'attachment'],
        body,
      })
      return documents
    },

    async getDocument(
      taskId: string,
      documentId: string,
      params?: GetTaskDocumentQuery
    ): Promise<Blob> {
      return http.get<Blob>({
        path: ['tasks', taskId, 'documents', documentId],
        query: params,
      })
    },

    async deleteDocument(
      taskId: string,
      documentId: string,
      params?: DeleteTaskDocumentQuery
    ): Promise<void> {
      await http.delete({
        path: ['tasks', taskId, 'documents', documentId],
        query: params,
      })
    },
  }
}

export type Tasks = ReturnType<typeof createTasks>
