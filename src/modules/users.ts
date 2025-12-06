import type { ApiClient } from '../client';
import type {
  CreateUserRequest,
  CreateUserResponse,
  ListUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  GetUserResponse,
  DeleteUserResponse,
  GetCurrentUserResponse,
  InviteUserResponse,
  MarkUserAsActiveResponse,
  MarkUserAsInactiveResponse,
} from '../types/user';

export class UserModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Get list of users configured.
   * If opts.limit is provided, return at most that many items.
   */
  async list(opts?: {
    limit?: number;
    filterBy?: string;
  }): Promise<ListUsersResponse['users']> {
    return this.client.getList({
      path: ['users'],
      params: opts?.filterBy ? { filter_by: opts.filterBy } : {},
      limit: opts?.limit,
      extractor: (res: ListUsersResponse) => res.users ?? [],
    });
  }

  async create(user: CreateUserRequest): Promise<CreateUserResponse> {
    const res = await this.client.post<CreateUserResponse>({
      path: ['users'],
      body: user,
    });

    return res;
  }

  async get(userId: string): Promise<GetUserResponse['user']> {
    const res = await this.client.get<GetUserResponse>({
      path: ['users', userId],
    });

    return res.user;
  }

  async current(): Promise<GetCurrentUserResponse['user']> {
    const res = await this.client.get<GetCurrentUserResponse>({
      path: ['users', 'me'],
    });

    return res.user;
  }

  async update(
    userId: string,
    user: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    const res = await this.client.put<UpdateUserResponse>({
      path: ['users', userId],
      body: user,
    });

    return res;
  }

  async delete(userId: string): Promise<DeleteUserResponse> {
    const res = await this.client.delete<DeleteUserResponse>({
      path: ['users', userId],
    });

    return res;
  }

  async invite(userId: string): Promise<InviteUserResponse> {
    const res = await this.client.get<InviteUserResponse>({
      path: ['users', userId, 'invite'],
    });

    return res;
  }

  async markAsActive(userId: string): Promise<MarkUserAsActiveResponse> {
    const res = await this.client.post<MarkUserAsActiveResponse>({
      path: ['users', userId, 'active'],
    });

    return res;
  }

  async markAsInactive(userId: string): Promise<MarkUserAsInactiveResponse> {
    const res = await this.client.post<MarkUserAsInactiveResponse>({
      path: ['users', userId, 'inactive'],
    });

    return res;
  }
}
