import xior, { isXiorError } from 'xior'

import { APIError } from '../errors.ts'
import { InMemoryTokenStore } from './memory-token-store.ts'
import type { StoredToken, TokenStore } from './token-store.ts'

const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000

export interface TokenProvider {
  getAccessToken(): Promise<string>
  remove(): Promise<boolean>
}

export interface OAuthTokenOptions {
  clientId: string
  clientSecret: string
  refreshToken: string
  orgId: string
  accountsUrl: string
  store?: TokenStore
}

export interface CachedToken {
  accessToken: string
  expiresAt: number
}

export interface TokenRefreshResponse {
  access_token: string
  expires_in?: number
}

export function isTokenRefreshResponse(value: unknown): value is TokenRefreshResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'access_token' in value &&
    typeof value.access_token === 'string'
  )
}

export function isFresh(
  token: Pick<StoredToken, 'accessToken' | 'expiresAt'> | null
): token is CachedToken {
  return (
    !!token?.accessToken &&
    !!token.expiresAt &&
    Date.now() < token.expiresAt - TOKEN_EXPIRY_BUFFER_MS
  )
}

export class OAuthToken implements TokenProvider {
  private readonly store: TokenStore
  private cached: CachedToken | null = null
  private refreshPromise: Promise<string> | null = null

  constructor(private readonly options: OAuthTokenOptions) {
    this.store = options.store ?? new InMemoryTokenStore()
  }

  getAccessToken(): Promise<string> {
    if (isFresh(this.cached)) return Promise.resolve(this.cached.accessToken)

    this.refreshPromise ??= this.resolveToken().finally(() => {
      this.refreshPromise = null
    })
    return this.refreshPromise
  }

  async remove(): Promise<boolean> {
    await this.store.deleteToken(this.options.clientId, this.options.orgId)
    this.cached = null
    return true
  }

  private async resolveToken(): Promise<string> {
    const { clientId, orgId } = this.options
    const stored = await this.store.findToken(clientId, orgId)

    if (isFresh(stored)) {
      this.cached = stored
      return stored.accessToken
    }

    return this.refresh()
  }

  private async refresh(): Promise<string> {
    const { clientId, clientSecret, refreshToken, orgId, accountsUrl } = this.options

    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    })

    const data = await this.requestNewToken(accountsUrl, params)

    const expiresIn = data.expires_in ?? 3600
    const cached: CachedToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + expiresIn * 1000,
    }

    await this.store.saveToken({
      accessToken: cached.accessToken,
      refreshToken,
      expiresAt: cached.expiresAt,
      clientId,
      orgId,
    })

    this.cached = cached
    return cached.accessToken
  }

  private async requestNewToken(
    accountsUrl: string,
    params: URLSearchParams
  ): Promise<TokenRefreshResponse> {
    let data: unknown
    try {
      const res = await xior.post<unknown>(accountsUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      data = res.data
    } catch (err) {
      throw isXiorError(err) ? APIError.fromXiorError(err) : err
    }

    if (!isTokenRefreshResponse(data)) {
      throw new APIError('Token refresh failed', undefined, accountsUrl, data)
    }
    return data
  }
}
