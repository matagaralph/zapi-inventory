import { describe, expect, expectTypeOf, test } from 'vitest'
import { MODULE_INVENTORY } from '../test/module-inventory.ts'
import {
  apiRequests,
  createFetch,
  createHangingFetch,
  createZohoFetch,
  json,
  tokenRequests,
  waitForAbort,
} from '../test/fetch.ts'
import { createMemoryTokenStore } from './auth/memory-token-store.ts'
import type { ZAPI, ZohoDataCenter } from './client.ts'
import { zAPI } from './client.ts'
import { isAPIError } from './errors.ts'
import type { HTTPClient } from './http.ts'
import type { SalesOrders } from './modules/salesorders.ts'
import * as sdk from './index.ts'

const credentials = {
  client: { id: 'client-id', secret: 'client-secret' },
  orgId: 'org-id',
  refreshToken: 'refresh-token',
}

describe('zAPI', () => {
  test('exposes the HTTP client and every resource under a lowercase property', () => {
    const inventory = zAPI(credentials)
    const resources = Object.keys(inventory).filter((key) => key !== 'http')

    expect(resources.sort()).toEqual(Object.keys(MODULE_INVENTORY).sort())
    for (const key of resources) expect(key).toBe(key.toLowerCase())
    expect(inventory).not.toHaveProperty('salesOrders')
    expect(inventory).not.toHaveProperty('shipmentOrders')
    expect(inventory).not.toHaveProperty('purchaseOrders')
  })

  test('infers the client type', () => {
    expectTypeOf<ZAPI>().toEqualTypeOf<ReturnType<typeof zAPI>>()
    expectTypeOf<ZAPI['salesorders']>().toEqualTypeOf<SalesOrders>()
    expectTypeOf<ZAPI['http']>().toEqualTypeOf<HTTPClient>()
    expectTypeOf<ZAPI['salesorders']['markAsConfirmed']>().parameters.toEqualTypeOf<[string]>()
  })

  test('authenticates and scopes every API request to the organisation', async () => {
    const { fetch, requests } = createZohoFetch(() => json({ salesorders: [] }))
    const inventory = zAPI({ ...credentials, fetch })

    await inventory.salesorders.list({ page: 2 })

    const [request] = apiRequests(requests)
    const url = new URL(request?.url ?? '')
    expect(url.origin + url.pathname).toBe('https://www.zohoapis.com/inventory/v1/salesorders')
    expect(Array.from(url.searchParams.entries())).toEqual([
      ['page', '2'],
      ['organization_id', 'org-id'],
    ])
    expect(request?.headers.get('authorization')).toBe('Zoho-oauthtoken access-token')
  })

  test.each<[ZohoDataCenter, string, string]>([
    ['com', 'https://www.zohoapis.com', 'https://accounts.zoho.com'],
    ['eu', 'https://www.zohoapis.eu', 'https://accounts.zoho.eu'],
    ['com.au', 'https://www.zohoapis.com.au', 'https://accounts.zoho.com.au'],
    ['com.cn', 'https://www.zohoapis.com.cn', 'https://accounts.zoho.com.cn'],
  ])('targets the %s data centre for API and OAuth requests', async (dc, api, accounts) => {
    const { fetch, requests } = createZohoFetch(() => json({ items: [] }))
    const inventory = zAPI({ ...credentials, dc, fetch })

    await inventory.items.list()

    expect(tokenRequests(requests)[0]?.url).toBe(`${accounts}/oauth/v2/token`)
    expect(apiRequests(requests)[0]?.url).toMatch(`${api}/inventory/v1/items?`)
  })

  test('uses the custom fetch for both OAuth and API requests', async () => {
    const { fetch, requests } = createZohoFetch(() => json({ item: { item_id: '1' } }))
    const inventory = zAPI({ ...credentials, fetch })

    await inventory.items.get('1')

    expect(tokenRequests(requests)).toHaveLength(1)
    expect(apiRequests(requests)).toHaveLength(1)
  })

  test('reuses the cached token across requests and refreshes it once for concurrent calls', async () => {
    const { fetch, requests } = createZohoFetch(() => json({ items: [] }))
    const inventory = zAPI({ ...credentials, fetch })

    await Promise.all([inventory.items.list(), inventory.items.list(), inventory.bills.list()])
    await inventory.items.list()

    expect(tokenRequests(requests)).toHaveLength(1)
    expect(apiRequests(requests)).toHaveLength(4)
  })

  test('keeps token state independent between clients', async () => {
    const first = createZohoFetch(() => json({ items: [] }), 'first-token')
    const second = createZohoFetch(() => json({ items: [] }), 'second-token')
    const firstClient = zAPI({ ...credentials, fetch: first.fetch })
    const secondClient = zAPI({ ...credentials, fetch: second.fetch })

    await firstClient.items.list()
    await secondClient.items.list()
    await firstClient.items.list()

    expect(tokenRequests(first.requests)).toHaveLength(1)
    expect(tokenRequests(second.requests)).toHaveLength(1)
    expect(apiRequests(second.requests)[0]?.headers.get('authorization')).toBe(
      'Zoho-oauthtoken second-token'
    )
  })

  test('reads and writes tokens through the configured store', async () => {
    const store = createMemoryTokenStore()
    await store.saveToken({
      accessToken: 'stored-token',
      refreshToken: 'refresh-token',
      expiresAt: Date.now() + 60 * 60 * 1000,
      clientId: 'client-id',
      orgId: 'org-id',
    })
    const { fetch, requests } = createZohoFetch(() => json({ items: [] }))
    const inventory = zAPI({ ...credentials, store, fetch })

    await inventory.items.list()

    expect(tokenRequests(requests)).toHaveLength(0)
    expect(apiRequests(requests)[0]?.headers.get('authorization')).toBe(
      'Zoho-oauthtoken stored-token'
    )
  })

  test('applies the timeout option to API requests', async () => {
    const { fetch } = createFetch((request, _call, signal) => {
      if (new URL(request.url).pathname === '/oauth/v2/token') {
        return json({ access_token: 'token', expires_in: 3600 })
      }
      return waitForAbort(signal)
    })
    const inventory = zAPI({ ...credentials, fetch, timeout: 20 })

    await expect(inventory.items.list()).rejects.toThrow('timeout of 20ms exceeded')
  })

  test('applies the timeout option to token refreshes too', async () => {
    const { fetch, requests } = createHangingFetch()
    const inventory = zAPI({ ...credentials, fetch, timeout: 20 })

    await expect(Promise.all([inventory.items.list(), inventory.bills.list()])).rejects.toThrow(
      'timeout of 20ms exceeded'
    )
    expect(tokenRequests(requests)).toHaveLength(1)
    expect(apiRequests(requests)).toHaveLength(0)
  })

  test('passes retryTimes through to the HTTP client', async () => {
    const { fetch, requests } = createZohoFetch(() => json({ message: 'Down' }, 503))
    const inventory = zAPI({ ...credentials, fetch, retryTimes: 0 })

    await expect(inventory.items.list()).rejects.toSatisfy(isAPIError)
    expect(apiRequests(requests)).toHaveLength(1)
  })

  test('sends direct requests through inventory.http with authentication', async () => {
    const { fetch, requests } = createZohoFetch(() => json({ ok: true }))
    const inventory = zAPI({ ...credentials, fetch })

    await expect(
      inventory.http.post({ path: ['beta', 'endpoint'], body: { a: 1 } })
    ).resolves.toEqual({
      ok: true,
    })
    expect(apiRequests(requests)[0]?.headers.get('authorization')).toBe(
      'Zoho-oauthtoken access-token'
    )
  })
})

/**
 * Resource IDs were joined into the URL unencoded, so an ID could rewrite the request: `?` and
 * `#` moved the SDK's own `organization_id` into an unsent fragment, letting the ID choose the
 * organisation, and `..` segments walked out of the resource to other endpoints.
 *
 * @see https://url.spec.whatwg.org/#path-state
 */
describe('resource IDs in paths', () => {
  test('cannot override the organisation through a query string or fragment', async () => {
    const { fetch, requests } = createZohoFetch(() => json({ salesorder: {} }))
    const inventory = zAPI({ ...credentials, fetch })

    await inventory.salesorders.get('order-1?organization_id=other#')

    const url = new URL(apiRequests(requests)[0]?.url ?? '')
    expect(url.pathname).toBe('/inventory/v1/salesorders/order-1%3Forganization_id%3Dother%23')
    expect(url.searchParams.getAll('organization_id')).toEqual(['org-id'])
    expect(url.hash).toBe('')
  })

  test('cannot add path segments with slashes', async () => {
    const { fetch, requests } = createZohoFetch(() => json({ salesorder: {} }))
    const inventory = zAPI({ ...credentials, fetch })

    await inventory.salesorders.get('1/../../items')

    expect(new URL(apiRequests(requests)[0]?.url ?? '').pathname).toBe(
      '/inventory/v1/salesorders/1%2F..%2F..%2Fitems'
    )
  })

  test.each(['..', '.'])('rejects the dot segment %s without sending a request', async (id) => {
    const { fetch, requests } = createZohoFetch(() => json({}))
    const inventory = zAPI({ ...credentials, fetch })

    await expect(inventory.salesorders.delete(id)).rejects.toSatisfy(isAPIError)
    expect(apiRequests(requests)).toHaveLength(0)
  })

  test('keeps percent-encoded dot segments inside the resource path', async () => {
    const { fetch, requests } = createZohoFetch(() => json({ salesorder: {} }))
    const inventory = zAPI({ ...credentials, fetch })

    await inventory.salesorders.get('%2e%2e')

    expect(new URL(apiRequests(requests)[0]?.url ?? '').pathname).toBe(
      '/inventory/v1/salesorders/%252e%252e'
    )
  })

  test('leaves ordinary IDs unchanged', async () => {
    const { fetch, requests } = createZohoFetch(() => json({ salesorder: {} }))
    const inventory = zAPI({ ...credentials, fetch })

    await inventory.salesorders.get('4815000000017005')

    expect(apiRequests(requests)[0]?.url).toBe(
      'https://www.zohoapis.com/inventory/v1/salesorders/4815000000017005?organization_id=org-id'
    )
  })
})

describe('public exports', () => {
  test('exports the entry point, error helpers, HTTP client and resource factories only', () => {
    const factories = Object.keys(sdk).filter(
      (key) => key.startsWith('create') && key !== 'createAPIError' && key !== 'createHTTPClient'
    )

    expect(sdk.zAPI).toBe(zAPI)
    expect(sdk.isAPIError).toBeTypeOf('function')
    expect(sdk.createAPIError).toBeTypeOf('function')
    expect(sdk.createHTTPClient).toBeTypeOf('function')
    expect(factories).toHaveLength(Object.keys(MODULE_INVENTORY).length)
    expect(sdk).not.toHaveProperty('default')
    expect(sdk).not.toHaveProperty('ZohoInventory')
    expect(sdk).not.toHaveProperty('APIError')
    expect(sdk).not.toHaveProperty('HTTPClient')
  })

  test('exports the public types', () => {
    expectTypeOf<sdk.ZAPI>().toEqualTypeOf<ZAPI>()
    expectTypeOf<sdk.ZAPIOptions['fetch']>().toEqualTypeOf<sdk.FetchFunction | undefined>()
    expectTypeOf(globalThis.fetch).toExtend<sdk.FetchFunction>()
    expectTypeOf(
      async (_input: string | URL | Request, _init?: RequestInit) => new Response()
    ).toExtend<sdk.FetchFunction>()
    expectTypeOf<sdk.ZohoInventoryOptions>().toEqualTypeOf<sdk.ZAPIOptions>()
    expectTypeOf<sdk.APIError>().toExtend<Error>()
    expectTypeOf(sdk.isAPIError).guards.toEqualTypeOf<sdk.APIError>()
    expectTypeOf<sdk.SalesOrders>().toEqualTypeOf<ReturnType<typeof sdk.createSalesOrders>>()
    expectTypeOf<sdk.StoredToken['clientId']>().toEqualTypeOf<string>()
    expectTypeOf<sdk.TokenStore['findToken']>().returns.toEqualTypeOf<
      Promise<sdk.StoredToken | null>
    >()
    expectTypeOf<sdk.CountryOption['country_code']>().toEqualTypeOf<string>()
    expectTypeOf<sdk.ReportMetadata['page']>().toEqualTypeOf<number>()
  })
})
