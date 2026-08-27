import type {
  CreateUserRequest,
  CreateUserResponse,
  GetCurrentUserResponse,
  GetUserResponse,
  InviteUserResponse,
  ListUsersResponse,
  MarkUserAsActiveResponse,
  MarkUserAsInactiveResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Users {
  constructor(private readonly http: HTTPClient) {}

  async list(): Promise<ListUsersResponse['users']> {
    const { users } = await this.http.get<ListUsersResponse>({ path: ['users'] })
    return users
  }

  async get(userId: string): Promise<GetUserResponse['user']> {
    const { user } = await this.http.get<GetUserResponse>({ path: ['users', userId] })
    return user
  }

  async getCurrent(): Promise<GetCurrentUserResponse['user']> {
    const { user } = await this.http.get<GetCurrentUserResponse>({ path: ['users', 'me'] })
    return user
  }

  async create(data: CreateUserRequest): Promise<CreateUserResponse> {
    return this.http.post<CreateUserResponse>({ path: ['users'], body: data })
  }

  async update(userId: string, data: UpdateUserRequest): Promise<UpdateUserResponse> {
    return this.http.put<UpdateUserResponse>({ path: ['users', userId], body: data })
  }

  async delete(userId: string): Promise<void> {
    await this.http.delete({ path: ['users', userId] })
  }

  async invite(userId: string): Promise<InviteUserResponse> {
    return this.http.post<InviteUserResponse>({ path: ['users', userId, 'invite'] })
  }

  async activate(userId: string): Promise<MarkUserAsActiveResponse> {
    return this.http.post<MarkUserAsActiveResponse>({ path: ['users', userId, 'active'] })
  }

  async deactivate(userId: string): Promise<MarkUserAsInactiveResponse> {
    return this.http.post<MarkUserAsInactiveResponse>({ path: ['users', userId, 'inactive'] })
  }
}
