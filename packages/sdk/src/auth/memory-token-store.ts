import type { StoredToken, TokenStore } from './token-store.ts'

function tokenKey(clientId: string, orgId: string): string {
  return `${clientId}:${orgId}`
}

/** Creates a {@link TokenStore} that keeps tokens in memory for the life of the process. */
export function createMemoryTokenStore(): TokenStore {
  const tokens = new Map<string, StoredToken>()

  return {
    async findToken(clientId, orgId) {
      return tokens.get(tokenKey(clientId, orgId)) ?? null
    },

    async saveToken(token) {
      tokens.set(tokenKey(token.clientId, token.orgId), token)
    },

    async deleteToken(clientId, orgId) {
      tokens.delete(tokenKey(clientId, orgId))
    },
  }
}
