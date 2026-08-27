import type { StoredToken, TokenStore } from './token-store.ts'

function tokenKey(clientId: string, orgId: string): string {
  return `${clientId}:${orgId}`
}

export class InMemoryTokenStore implements TokenStore {
  private readonly tokens = new Map<string, StoredToken>()

  async findToken(clientId: string, orgId: string): Promise<StoredToken | null> {
    return this.tokens.get(tokenKey(clientId, orgId)) ?? null
  }

  async saveToken(token: StoredToken): Promise<void> {
    this.tokens.set(tokenKey(token.clientId, token.orgId), token)
  }

  async deleteToken(clientId: string, orgId: string): Promise<void> {
    this.tokens.delete(tokenKey(clientId, orgId))
  }
}
