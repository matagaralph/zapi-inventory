import { afterEach, describe, expect, test, vi } from 'vitest'
import { createFetch, createHangingFetch, json } from '../../test/fetch.ts'
import type { APIError } from '../errors.ts'
import { isAPIError } from '../errors.ts'
import type { FetchHandler } from '../../test/fetch.ts'
import type { FetchFunction } from '../http.ts'
import { createOAuthToken, isFresh, isTokenRefreshResponse } from './oauth.ts'
import type { StoredToken, TokenStore } from './token-store.ts'

const accountsUrl = 'https://accounts.example.com/oauth/v2/token'

interface RecordingTokenStore extends TokenStore {
  saves: StoredToken[]
  deletions: Array<{ clientId: string; orgId: string }>
}

function createRecordingTokenStore(seed: StoredToken[] = []): RecordingTokenStore {
  const key = (clientId: string, orgId: string) => `${clientId}:${orgId}`
  const tokens = new Map(seed.map((token) => [key(token.clientId, token.orgId), token]))
  const saves: StoredToken[] = []
  const deletions: Array<{ clientId: string; orgId: string }> = []

  return {
    saves,
    deletions,
    async findToken(clientId, orgId) {
      return tokens.get(key(clientId, orgId)) ?? null
    },
    async saveToken(token) {
      saves.push(token)
      tokens.set(key(token.clientId, token.orgId), token)
    },
    async deleteToken(clientId, orgId) {
      deletions.push({ clientId, orgId })
      tokens.delete(key(clientId, orgId))
    },
  }
}

function storedToken(overrides: Partial<StoredToken> = {}): StoredToken {
  return {
    accessToken: 'cached-token',
    refreshToken: 'refresh-token',
    expiresAt: Date.now() + 15 * 60 * 1000,
    clientId: 'client-id',
    orgId: 'org-id',
    ...overrides,
  }
}

const issueTokens: FetchHandler = async (request, call) => {
  const params = new URLSearchParams(await request.text())
  return json({ access_token: `access-${params.get('refresh_token')}-${call}`, expires_in: 3600 })
}

function createProvider(fetch: FetchFunction, store?: TokenStore) {
  return createOAuthToken({
    clientId: 'client-id',
    clientSecret: 'client-secret',
    refreshToken: 'refresh-token',
    orgId: 'org-id',
    accountsUrl,
    store,
    fetch,
  })
}

async function captureAPIError(promise: Promise<string>): Promise<APIError> {
  try {
    await promise
  } catch (error) {
    if (isAPIError(error)) return error
    throw error
  }
  throw new Error('expected the token request to reject')
}

afterEach(() => {
  vi.useRealTimers()
})

describe('isFresh', () => {
  test('true when the token has time remaining beyond the expiry buffer', () => {
    expect(isFresh({ accessToken: 'abc', expiresAt: Date.now() + 10 * 60 * 1000 })).toBe(true)
  })

  test('false when the token falls within the expiry buffer', () => {
    expect(isFresh({ accessToken: 'abc', expiresAt: Date.now() + 60 * 1000 })).toBe(false)
  })

  test('false when the token is already expired', () => {
    expect(isFresh({ accessToken: 'abc', expiresAt: Date.now() - 1000 })).toBe(false)
  })

  test('false for null', () => {
    expect(isFresh(null)).toBe(false)
  })

  test('false when accessToken is empty', () => {
    expect(isFresh({ accessToken: '', expiresAt: Date.now() + 10 * 60 * 1000 })).toBe(false)
  })

  test('false when expiresAt is zero', () => {
    expect(isFresh({ accessToken: 'abc', expiresAt: 0 })).toBe(false)
  })
})

describe('isTokenRefreshResponse', () => {
  test('true when access_token is a string', () => {
    expect(isTokenRefreshResponse({ access_token: 'tok' })).toBe(true)
  })

  test('true when expires_in is also present', () => {
    expect(isTokenRefreshResponse({ access_token: 'tok', expires_in: 3600 })).toBe(true)
  })

  test('false when access_token is missing', () => {
    expect(isTokenRefreshResponse({})).toBe(false)
  })

  test('false when access_token is not a string', () => {
    expect(isTokenRefreshResponse({ access_token: 12345 })).toBe(false)
  })

  test('false for non-object values', () => {
    expect(isTokenRefreshResponse(null)).toBe(false)
    expect(isTokenRefreshResponse(undefined)).toBe(false)
    expect(isTokenRefreshResponse('tok')).toBe(false)
  })
})

describe('createOAuthToken', () => {
  test('returns a fresh stored token without hitting the token endpoint', async () => {
    const { fetch, requests } = createFetch(issueTokens)
    const store = createRecordingTokenStore([storedToken()])
    const auth = createProvider(fetch, store)

    await expect(auth.getAccessToken()).resolves.toBe('cached-token')
    expect(requests).toHaveLength(0)
    expect(store.saves).toHaveLength(0)
  })

  test('refreshes a stale stored token with a form-encoded request and persists the result', async () => {
    const { fetch, requests } = createFetch(issueTokens)
    const store = createRecordingTokenStore([storedToken({ expiresAt: Date.now() - 1 })])
    const auth = createProvider(fetch, store)

    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-1')

    const [request] = requests
    expect(request?.method).toBe('POST')
    expect(request?.url).toBe(accountsUrl)
    expect(request?.headers.get('content-type')).toBe('application/x-www-form-urlencoded')
    expect(Object.fromEntries(new URLSearchParams(await request?.text()))).toEqual({
      refresh_token: 'refresh-token',
      client_id: 'client-id',
      client_secret: 'client-secret',
      grant_type: 'refresh_token',
    })
    expect(store.saves).toHaveLength(1)
    expect(store.saves[0]).toMatchObject({
      accessToken: 'access-refresh-token-1',
      refreshToken: 'refresh-token',
      clientId: 'client-id',
      orgId: 'org-id',
    })
    expect(store.saves[0]?.expiresAt).toBeGreaterThan(Date.now())
  })

  test('caches the token in memory until it enters the expiry buffer', async () => {
    vi.useFakeTimers({ now: new Date('2026-01-01T00:00:00Z') })
    const { fetch, requests } = createFetch(issueTokens)
    const auth = createProvider(fetch)

    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-1')
    vi.setSystemTime(new Date('2026-01-01T00:54:59Z'))
    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-1')
    expect(requests).toHaveLength(1)

    // 3600 seconds of validity minus the five minute buffer ends at 00:55.
    vi.setSystemTime(new Date('2026-01-01T00:55:00Z'))
    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-2')
    expect(requests).toHaveLength(2)
  })

  test('defaults to one hour of validity when expires_in is missing', async () => {
    vi.useFakeTimers({ now: new Date('2026-01-01T00:00:00Z') })
    const { fetch } = createFetch(() => json({ access_token: 'token' }))
    const store = createRecordingTokenStore()
    const auth = createProvider(fetch, store)

    await auth.getAccessToken()

    expect(store.saves[0]?.expiresAt).toBe(Date.parse('2026-01-01T01:00:00Z'))
  })

  test('deduplicates concurrent refresh requests', async () => {
    let release = () => {}
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const { fetch, requests } = createFetch(async (request, call, signal) => {
      await gate
      return issueTokens(request, call, signal)
    })
    const store = createRecordingTokenStore()
    const auth = createProvider(fetch, store)

    const pending = Promise.all([
      auth.getAccessToken(),
      auth.getAccessToken(),
      auth.getAccessToken(),
    ])
    release()

    await expect(pending).resolves.toEqual([
      'access-refresh-token-1',
      'access-refresh-token-1',
      'access-refresh-token-1',
    ])
    expect(requests).toHaveLength(1)
    expect(store.saves).toHaveLength(1)
  })

  test('removes stored tokens and clears the in-memory cache', async () => {
    const { fetch, requests } = createFetch(issueTokens)
    const store = createRecordingTokenStore([storedToken()])
    const auth = createProvider(fetch, store)

    await expect(auth.getAccessToken()).resolves.toBe('cached-token')
    await expect(auth.remove()).resolves.toBe(true)
    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-1')

    expect(store.deletions).toEqual([{ clientId: 'client-id', orgId: 'org-id' }])
    expect(requests).toHaveLength(1)
  })

  test('throws APIError when the refresh response body is invalid', async () => {
    const { fetch } = createFetch(() => json({ error: 'invalid_code' }))
    const auth = createProvider(fetch)

    const error = await captureAPIError(auth.getAccessToken())

    expect(error.message).toBe('Token refresh failed')
    expect(error.url).toBe(accountsUrl)
    expect(error.statusCode).toBeUndefined()
    expect(error.data).toEqual({ error: 'invalid_code' })
  })

  test('throws APIError when the token endpoint responds with an HTTP error', async () => {
    const { fetch } = createFetch(() => json({ message: 'Invalid client' }, 401))
    const auth = createProvider(fetch)

    const error = await captureAPIError(auth.getAccessToken())

    expect(error.message).toBe('Invalid client')
    expect(error.statusCode).toBe(401)
    expect(error.url).toBe(accountsUrl)
  })

  test('throws APIError when the token endpoint cannot be reached', async () => {
    const { fetch } = createFetch(() => Promise.reject(new TypeError('fetch failed')))
    const auth = createProvider(fetch)

    const error = await captureAPIError(auth.getAccessToken())

    expect(error.message).toBe('fetch failed')
    expect(error.url).toBe(accountsUrl)
  })

  test('does not retry a failed refresh, but tries again on the next call', async () => {
    const { fetch, requests } = createFetch((request, call, signal) =>
      call === 1 ? json({ message: 'Down' }, 500) : issueTokens(request, call, signal)
    )
    const auth = createProvider(fetch)

    await expect(auth.getAccessToken()).rejects.toSatisfy(isAPIError)
    expect(requests).toHaveLength(1)
    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-2')
  })

  /**
   * Stored tokens were looked up by client and organisation only, so two users of the same
   * OAuth client and organisation sharing a store could be handed each other's access token,
   * and with it each other's permissions.
   */
  test('never uses a token minted for a different grant from a shared store', async () => {
    const { fetch, requests } = createFetch(issueTokens)
    const store = createRecordingTokenStore()
    const grant = (refreshToken: string) =>
      createOAuthToken({
        clientId: 'client-id',
        clientSecret: 'client-secret',
        refreshToken,
        orgId: 'org-id',
        accountsUrl,
        store,
        fetch,
      })

    await expect(grant('admin-grant').getAccessToken()).resolves.toBe('access-admin-grant-1')
    await expect(grant('restricted-grant').getAccessToken()).resolves.toBe(
      'access-restricted-grant-2'
    )
    expect(requests).toHaveLength(2)
  })

  test('ignores stored tokens that do not record their grant', async () => {
    const { fetch, requests } = createFetch(issueTokens)
    const store = createRecordingTokenStore([storedToken({ refreshToken: null })])

    await expect(createProvider(fetch, store).getAccessToken()).resolves.toBe(
      'access-refresh-token-1'
    )
    expect(requests).toHaveLength(1)
  })

  /**
   * The token request had no timeout and runs before the API request's timer starts, so a
   * stalled accounts server blocked every request waiting on the shared refresh forever.
   */
  test('times out a stalled token refresh after 10 seconds by default', async () => {
    vi.useFakeTimers()
    const { fetch, requests } = createHangingFetch()
    const auth = createProvider(fetch)

    const pending = Promise.allSettled([auth.getAccessToken(), auth.getAccessToken()])
    await vi.advanceTimersByTimeAsync(10_000)

    const results = await pending
    for (const result of results) {
      expect(result.status).toBe('rejected')
      if (result.status === 'rejected') {
        expect(isAPIError(result.reason)).toBe(true)
        expect(String(result.reason)).toBe('APIError: timeout of 10000ms exceeded')
      }
    }
    expect(requests).toHaveLength(1)
  })

  test('honours the timeout option for token refreshes', async () => {
    vi.useFakeTimers()
    const { fetch } = createHangingFetch()
    const auth = createOAuthToken({
      clientId: 'client-id',
      clientSecret: 'client-secret',
      refreshToken: 'refresh-token',
      orgId: 'org-id',
      accountsUrl,
      fetch,
      timeout: 250,
    })

    const pending = captureAPIError(auth.getAccessToken())
    await vi.advanceTimersByTimeAsync(250)

    expect((await pending).message).toBe('timeout of 250ms exceeded')
  })

  /** A refresh already in flight when remove() ran used to save and cache its token afterwards. */
  test('does not let a refresh in flight restore a removed token', async () => {
    let release = () => {}
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const { fetch, requests } = createFetch(async (request, call, signal) => {
      if (call === 1) await gate
      return issueTokens(request, call, signal)
    })
    const store = createRecordingTokenStore()
    const auth = createProvider(fetch, store)

    const inFlight = auth.getAccessToken()
    await vi.waitFor(() => expect(requests).toHaveLength(1))
    await auth.remove()
    release()
    await inFlight

    expect(await store.findToken('client-id', 'org-id')).toBeNull()
    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-2')
    expect(requests).toHaveLength(2)
  })

  test('removes a token whose save was still in progress when remove() ran', async () => {
    const { fetch } = createFetch(issueTokens)
    const inner = createRecordingTokenStore()
    let releaseSave = () => {}
    let saveStarted = () => {}
    const saving = new Promise<void>((resolve) => {
      saveStarted = resolve
    })
    const store: TokenStore = {
      findToken: inner.findToken,
      deleteToken: inner.deleteToken,
      async saveToken(token) {
        saveStarted()
        // Lands after remove() has already deleted, like a slow write to a remote store.
        await new Promise<void>((resolve) => {
          releaseSave = resolve
        })
        await inner.saveToken(token)
      },
    }
    const auth = createProvider(fetch, store)

    const inFlight = auth.getAccessToken()
    await saving
    await auth.remove()
    releaseSave()
    await inFlight

    expect(await inner.findToken('client-id', 'org-id')).toBeNull()
  })

  test('does not reuse the removed token while a slow store is still deleting it', async () => {
    const { fetch, requests } = createFetch(issueTokens)
    const inner = createRecordingTokenStore([storedToken()])
    let releaseDelete = () => {}
    const store: TokenStore = {
      findToken: inner.findToken,
      saveToken: inner.saveToken,
      async deleteToken(clientId, orgId) {
        await new Promise<void>((resolve) => {
          releaseDelete = resolve
        })
        await inner.deleteToken(clientId, orgId)
      },
    }
    const auth = createProvider(fetch, store)
    await expect(auth.getAccessToken()).resolves.toBe('cached-token')

    const removal = auth.remove()
    const during = auth.getAccessToken()
    releaseDelete()
    await removal

    await expect(during).resolves.toBe('access-refresh-token-1')
    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-1')
    expect(requests).toHaveLength(1)
  })

  test('still refreshes after a failed removal', async () => {
    const { fetch } = createFetch(issueTokens)
    const inner = createRecordingTokenStore([storedToken()])
    const store: TokenStore = {
      findToken: inner.findToken,
      saveToken: inner.saveToken,
      deleteToken: () => Promise.reject(new Error('store offline')),
    }
    const auth = createProvider(fetch, store)

    await expect(auth.remove()).rejects.toThrow('store offline')
    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-1')
  })

  test('starts a new refresh after remove() instead of joining the stale one', async () => {
    let release = () => {}
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const { fetch, requests } = createFetch(async (request, call, signal) => {
      if (call === 1) await gate
      return issueTokens(request, call, signal)
    })
    const auth = createProvider(fetch)

    const stale = auth.getAccessToken()
    await vi.waitFor(() => expect(requests).toHaveLength(1))
    await auth.remove()
    const fresh = auth.getAccessToken()
    release()

    await expect(stale).resolves.toBe('access-refresh-token-1')
    await expect(fresh).resolves.toBe('access-refresh-token-2')
    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-2')
    expect(requests).toHaveLength(2)
  })

  test('keeps the token cache private to each provider', async () => {
    const first = createFetch(issueTokens)
    const second = createFetch(issueTokens)
    const firstAuth = createProvider(first.fetch)
    const secondAuth = createProvider(second.fetch)

    await firstAuth.getAccessToken()
    await firstAuth.getAccessToken()
    await secondAuth.getAccessToken()

    expect(first.requests).toHaveLength(1)
    expect(second.requests).toHaveLength(1)
  })
})
