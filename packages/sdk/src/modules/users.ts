import type {
  CreateUserRequest,
  GetCurrentUserResponse,
  GetUserResponse,
  ListUsersResponse,
  UpdateUserRequest,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * Users are various individuals/entities that are a part of an organisation. Each user will have a different role to play, like admin, staff etc., .
 */
export function createUsers(http: HTTPClient) {
  return {
    async list(): Promise<ListUsersResponse['users']> {
      const { users } = await http.get<ListUsersResponse>({ path: ['users'] })
      return users
    },

    async get(userId: string): Promise<GetUserResponse['user']> {
      const { user } = await http.get<GetUserResponse>({ path: ['users', userId] })
      return user
    },

    async getCurrent(): Promise<GetCurrentUserResponse['user']> {
      const { user } = await http.get<GetCurrentUserResponse>({ path: ['users', 'me'] })
      return user
    },

    async create(data: CreateUserRequest): Promise<void> {
      await http.post({ path: ['users'], body: data })
    },

    async update(userId: string, data: UpdateUserRequest): Promise<void> {
      await http.put({ path: ['users', userId], body: data })
    },

    async delete(userId: string): Promise<void> {
      await http.delete({ path: ['users', userId] })
    },

    async invite(userId: string): Promise<void> {
      await http.post({ path: ['users', userId, 'invite'] })
    },

    async activate(userId: string): Promise<void> {
      await http.post({ path: ['users', userId, 'active'] })
    },

    async deactivate(userId: string): Promise<void> {
      await http.post({ path: ['users', userId, 'inactive'] })
    },
  }
}

export type Users = ReturnType<typeof createUsers>
