/** An OAuth access token persisted by a {@link TokenStore}. */
export interface StoredToken {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  clientId: string
  orgId: string
}

/**
 * Persists access tokens between requests, processes or restarts. Tokens are scoped by the
 * `clientId` and `orgId` pair.
 */
export interface TokenStore {
  findToken(clientId: string, orgId: string): Promise<StoredToken | null>
  saveToken(token: StoredToken): Promise<void>
  deleteToken(clientId: string, orgId: string): Promise<void>
}
