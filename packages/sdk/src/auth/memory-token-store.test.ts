import { describe, expect, test } from 'bun:test'
import { InMemoryTokenStore } from './memory-token-store.ts'
import type { StoredToken } from './token-store.ts'

function token(overrides: Partial<StoredToken> = {}): StoredToken {
  return {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresAt: Date.now() + 60_000,
    clientId: 'client-id',
    orgId: 'org-id',
    ...overrides,
  }
}

describe('InMemoryTokenStore', () => {
  test('returns null when no token has been saved for the identity', async () => {
    const store = new InMemoryTokenStore()
    expect(await store.findToken('client-id', 'org-id')).toBeNull()
  })

  test('round-trips a saved token', async () => {
    const store = new InMemoryTokenStore()
    const saved = token()

    await store.saveToken(saved)

    expect(await store.findToken('client-id', 'org-id')).toEqual(saved)
  })

  test('scopes tokens by the clientId/orgId pair, not by either alone', async () => {
    const store = new InMemoryTokenStore()
    const forOrgA = token({ clientId: 'client-id', orgId: 'org-a', accessToken: 'token-a' })
    const forOrgB = token({ clientId: 'client-id', orgId: 'org-b', accessToken: 'token-b' })
    const forOtherClient = token({
      clientId: 'other-client',
      orgId: 'org-a',
      accessToken: 'token-c',
    })

    await store.saveToken(forOrgA)
    await store.saveToken(forOrgB)
    await store.saveToken(forOtherClient)

    expect(await store.findToken('client-id', 'org-a')).toEqual(forOrgA)
    expect(await store.findToken('client-id', 'org-b')).toEqual(forOrgB)
    expect(await store.findToken('other-client', 'org-a')).toEqual(forOtherClient)
  })

  test('deleteToken only removes the matching identity', async () => {
    const store = new InMemoryTokenStore()
    await store.saveToken(token({ clientId: 'client-id', orgId: 'org-a' }))
    await store.saveToken(token({ clientId: 'client-id', orgId: 'org-b' }))

    await store.deleteToken('client-id', 'org-a')

    expect(await store.findToken('client-id', 'org-a')).toBeNull()
    expect(await store.findToken('client-id', 'org-b')).not.toBeNull()
  })

  test('deleteToken is a no-op for an identity that was never saved', async () => {
    const store = new InMemoryTokenStore()
    await expect(store.deleteToken('missing-client', 'missing-org')).resolves.toBeUndefined()
  })
})
