import { createAPIError } from '../errors.ts'
import type { FetchFunction } from '../http.ts'
import { sendRequest } from '../http.ts'
import { createMemoryTokenStore } from './memory-token-store.ts'
import type { StoredToken, TokenStore } from './token-store.ts'

const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000
const DEFAULT_TIMEOUT_MS = 10_000

/** Supplies OAuth access tokens to the HTTP client. */
export interface TokenProvider {
  /** Resolves to a fresh access token, refreshing it at most once across concurrent callers. */
  getAccessToken(): Promise<string>
  /** Deletes the stored token and clears the cached one, forcing the next call to refresh. */
  remove(): Promise<boolean>
}

export interface OAuthTokenOptions {
  clientId: string
  clientSecret: string
  refreshToken: string
  orgId: string
  accountsUrl: string
  store?: TokenStore
  /** The `fetch` implementation used for token refreshes. Defaults to `globalThis.fetch`. */
  fetch?: FetchFunction
  /** Milliseconds before a token refresh is aborted. Defaults to `10000`, and `0` disables it. */
  timeout?: number
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

/**
 * Creates a {@link TokenProvider} that exchanges a refresh token for access tokens. The cached
 * token and any in-flight refresh are private to the returned provider.
 */
export function createOAuthToken(options: OAuthTokenOptions): TokenProvider {
  const store = options.store ?? createMemoryTokenStore()
  let cached: CachedToken | null = null
  let refreshPromise: Promise<string> | null = null
  // Bumped by remove(). A refresh started under an older generation still answers its own
  // callers, but must not save or cache its token, which would undo the removal.
  let generation = 0
  // After remove(), the store may still hold the removed token until a slow delete lands (or
  // forever, if it failed), so the next refresh skips the store and waits for the delete.
  let skipStore = false
  let pendingDelete: Promise<void> | null = null

  async function requestNewToken(params: URLSearchParams): Promise<TokenRefreshResponse> {
    const data = await sendRequest<unknown>({
      method: 'POST',
      url: options.accountsUrl,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
      fetch: options.fetch,
      timeout: options.timeout ?? DEFAULT_TIMEOUT_MS,
    })

    if (!isTokenRefreshResponse(data)) {
      throw createAPIError('Token refresh failed', { url: options.accountsUrl, data })
    }
    return data
  }

  async function refresh(startedAt: number): Promise<string> {
    const { clientId, clientSecret, refreshToken, orgId } = options

    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    })

    const data = await requestNewToken(params)

    const expiresIn = data.expires_in ?? 3600
    const token: CachedToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + expiresIn * 1000,
    }

    if (startedAt !== generation) return token.accessToken

    // A save that lands before a slow delete would be wiped by it, so let the delete finish.
    await pendingDelete?.catch(() => undefined)
    if (startedAt !== generation) return token.accessToken

    await store.saveToken({
      accessToken: token.accessToken,
      refreshToken,
      expiresAt: token.expiresAt,
      clientId,
      orgId,
    })

    if (startedAt !== generation) {
      // remove() ran while the save was in flight, and the store may have applied its delete
      // first. Delete again so the removal wins. At worst this costs one extra refresh.
      await store.deleteToken(clientId, orgId)
      return token.accessToken
    }

    cached = token
    skipStore = false
    return token.accessToken
  }

  async function resolveToken(startedAt: number): Promise<string> {
    if (skipStore) return refresh(startedAt)

    const stored = await store.findToken(options.clientId, options.orgId)

    // A store shared between users of the same client and organisation can hold another
    // user's token, so only reuse one minted from this provider's own refresh token.
    if (stored?.refreshToken === options.refreshToken && isFresh(stored)) {
      if (startedAt === generation) cached = stored
      return stored.accessToken
    }

    return refresh(startedAt)
  }

  return {
    getAccessToken() {
      if (isFresh(cached)) return Promise.resolve(cached.accessToken)

      if (refreshPromise) return refreshPromise

      const pending = resolveToken(generation).finally(() => {
        // remove() may have replaced this refresh with a newer one, so only clear our own.
        if (refreshPromise === pending) refreshPromise = null
      })
      refreshPromise = pending
      return pending
    },

    async remove() {
      generation += 1
      cached = null
      refreshPromise = null
      skipStore = true

      const deletion = store.deleteToken(options.clientId, options.orgId)
      pendingDelete = deletion
      try {
        await deletion
      } finally {
        if (pendingDelete === deletion) pendingDelete = null
      }
      return true
    },
  }
}
