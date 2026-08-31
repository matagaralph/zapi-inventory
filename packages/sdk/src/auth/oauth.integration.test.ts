import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test'
import { APIError } from '../errors.ts'
import { OAuthToken, type TokenRefreshResponse } from './oauth.ts'
import type { StoredToken, TokenStore } from './token-store.ts'

function key(clientId: string, orgId: string): string {
  return `${clientId}:${orgId}`
}

class RecordingTokenStore implements TokenStore {
  readonly tokens = new Map<string, StoredToken>()
  readonly saves: StoredToken[] = []
  readonly deletions: Array<{ clientId: string; orgId: string }> = []

  constructor(seed: StoredToken[] = []) {
    for (const token of seed) this.tokens.set(key(token.clientId, token.orgId), token)
  }

  async findToken(clientId: string, orgId: string): Promise<StoredToken | null> {
    return this.tokens.get(key(clientId, orgId)) ?? null
  }

  async saveToken(token: StoredToken): Promise<void> {
    this.saves.push(token)
    this.tokens.set(key(token.clientId, token.orgId), token)
  }

  async deleteToken(clientId: string, orgId: string): Promise<void> {
    this.deletions.push({ clientId, orgId })
    this.tokens.delete(key(clientId, orgId))
  }
}

let server: ReturnType<typeof Bun.serve>
let accountsUrl: string
let refreshCount = 0
let latestRefreshBody = ''
let refreshGate: Promise<void> | null = null

beforeAll(() => {
  server = Bun.serve({
    port: 0,
    async fetch(req) {
      const url = new URL(req.url)
      if (url.pathname !== '/oauth/v2/token') {
        return new Response('not found', { status: 404 })
      }

      refreshCount += 1
      latestRefreshBody = await req.text()

      if (refreshGate) await refreshGate

      const params = new URLSearchParams(latestRefreshBody)
      const token = params.get('refresh_token') ?? 'missing'

      return Response.json({
        access_token: `access-${token}-${refreshCount}`,
        expires_in: 3600,
      } satisfies TokenRefreshResponse)
    },
  })

  accountsUrl = `http://localhost:${server.port}/oauth/v2/token`
})

afterAll(() => {
  server.stop()
})

beforeEach(() => {
  refreshCount = 0
  latestRefreshBody = ''
  refreshGate = null
})

function freshToken(): StoredToken {
  return {
    accessToken: 'cached-token',
    refreshToken: 'refresh-token',
    expiresAt: Date.now() + 15 * 60 * 1000,
    clientId: 'client-id',
    orgId: 'org-id',
  }
}

describe('OAuthToken', () => {
  test('returns a fresh stored token without hitting the token endpoint', async () => {
    refreshCount = 0
    const store = new RecordingTokenStore([freshToken()])
    const auth = new OAuthToken({
      clientId: 'client-id',
      clientSecret: 'client-secret',
      refreshToken: 'refresh-token',
      orgId: 'org-id',
      accountsUrl,
      store,
    })

    await expect(auth.getAccessToken()).resolves.toBe('cached-token')
    expect(refreshCount).toBe(0)
    expect(store.saves).toHaveLength(0)
  })

  test('refreshes when the stored token is stale and persists the new token', async () => {
    refreshCount = 0
    latestRefreshBody = ''
    const store = new RecordingTokenStore([
      {
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() - 1,
        clientId: 'client-id',
        orgId: 'org-id',
      },
    ])
    const auth = new OAuthToken({
      clientId: 'client-id',
      clientSecret: 'client-secret',
      refreshToken: 'refresh-token',
      orgId: 'org-id',
      accountsUrl,
      store,
    })

    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-1')
    expect(refreshCount).toBe(1)
    expect(new URLSearchParams(latestRefreshBody).get('grant_type')).toBe('refresh_token')
    expect(new URLSearchParams(latestRefreshBody).get('client_id')).toBe('client-id')
    expect(store.saves).toHaveLength(1)
    expect(store.saves[0]).toMatchObject({
      accessToken: 'access-refresh-token-1',
      refreshToken: 'refresh-token',
      clientId: 'client-id',
      orgId: 'org-id',
    })
    expect(store.saves[0]?.expiresAt).toBeGreaterThan(Date.now())
  })

  test('deduplicates concurrent refresh requests', async () => {
    refreshCount = 0
    latestRefreshBody = ''
    const store = new RecordingTokenStore()
    const auth = new OAuthToken({
      clientId: 'client-id',
      clientSecret: 'client-secret',
      refreshToken: 'refresh-token',
      orgId: 'org-id',
      accountsUrl,
      store,
    })

    let releaseRefresh = () => {}
    refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve
    })

    const pending = Promise.all([auth.getAccessToken(), auth.getAccessToken()])
    releaseRefresh()
    refreshGate = null

    await expect(pending).resolves.toEqual(['access-refresh-token-1', 'access-refresh-token-1'])
    expect(refreshCount).toBe(1)
    expect(store.saves).toHaveLength(1)
  })

  test('removes stored tokens and clears the in-memory cache', async () => {
    refreshCount = 0
    const store = new RecordingTokenStore([freshToken()])
    const auth = new OAuthToken({
      clientId: 'client-id',
      clientSecret: 'client-secret',
      refreshToken: 'refresh-token',
      orgId: 'org-id',
      accountsUrl,
      store,
    })

    await expect(auth.getAccessToken()).resolves.toBe('cached-token')
    await expect(auth.remove()).resolves.toBe(true)
    await expect(auth.getAccessToken()).resolves.toBe('access-refresh-token-1')

    expect(store.deletions).toEqual([{ clientId: 'client-id', orgId: 'org-id' }])
    expect(refreshCount).toBe(1)
  })

  test('throws APIError when the refresh response body is invalid', async () => {
    const invalidServer = Bun.serve({
      port: 0,
      fetch() {
        return Response.json({ expires_in: 3600 })
      },
    })
    const auth = new OAuthToken({
      clientId: 'client-id',
      clientSecret: 'client-secret',
      refreshToken: 'refresh-token',
      orgId: 'org-id',
      accountsUrl: `http://localhost:${invalidServer.port}/oauth/v2/token`,
      store: new RecordingTokenStore(),
    })

    let thrown: APIError | undefined
    try {
      await auth.getAccessToken()
    } catch (err) {
      if (err instanceof APIError) thrown = err
    } finally {
      invalidServer.stop()
    }

    expect(thrown).toBeInstanceOf(APIError)
    expect(thrown?.message).toBe('Token refresh failed')
  })
})
