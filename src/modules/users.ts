import type { ApiClient } from '../client';
import type {
  CreateUserRequest,
  ListUsersResponse,
  UpdateUserRequest,
  GetUserResponse,
  GetCurrentUserResponse,
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
    filter_by?: string;
  }): Promise<ListUsersResponse['users']> {
    const { limit, ...params } = opts ?? {};
    return this.client.getList({
      path: ['users'],
      params,
      limit,
      extractor: (res: ListUsersResponse) => res.users ?? [],
    });
  }

  create(user: CreateUserRequest): Promise<void> {
    return this.client.post<void>({
      path: ['users'],
      body: user,
    });
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

  async update(userId: string, user: UpdateUserRequest): Promise<void> {
    return this.client.put({
      path: ['users', userId],
      body: user,
    });
  }

  async delete(userId: string): Promise<void> {
    return this.client.delete({
      path: ['users', userId],
    });
  }

  invite(userId: string): Promise<void> {
    return this.client.get({
      path: ['users', userId, 'invite'],
    });
  }

  markAsActive(userId: string): Promise<void> {
    return this.client.post({
      path: ['users', userId, 'active'],
    });
  }

  markAsInactive(userId: string): Promise<void> {
    return this.client.post({
      path: ['users', userId, 'inactive'],
    });
  }
}
