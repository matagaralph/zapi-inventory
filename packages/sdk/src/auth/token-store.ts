export interface StoredToken {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  clientId: string
  orgId: string
}

export interface TokenStore {
  findToken(clientId: string, orgId: string): Promise<StoredToken | null>
  saveToken(token: StoredToken): Promise<void>
  deleteToken(clientId: string, orgId: string): Promise<void>
}
