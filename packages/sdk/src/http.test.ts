import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { APIError } from './errors.ts'
import { HTTPClient } from './http.ts'

interface LastRequest {
  method: string
  path: string
  search: string
  headers: Headers
  body?: unknown
}

let server: ReturnType<typeof Bun.serve>
let baseURL: string
let lastRequest: LastRequest | undefined
let requestCounts: Record<string, number>

beforeAll(() => {
  requestCounts = {}

  server = Bun.serve({
    port: 0,
    async fetch(req) {
      const url = new URL(req.url)
      const count = (requestCounts[url.pathname] ?? 0) + 1
      requestCounts[url.pathname] = count

      const captured: LastRequest = {
        method: req.method,
        path: url.pathname,
        search: url.search,
        headers: req.headers,
      }

      if (req.method !== 'GET' && req.method !== 'DELETE') {
        const contentType = req.headers.get('content-type') ?? ''
        if (contentType.includes('application/json')) {
          captured.body = await req.json()
        } else {
          captured.body = await req.text()
        }
      }

      lastRequest = captured

      if (url.pathname === '/fail') {
        return new Response(JSON.stringify({ message: 'Nope', code: 99 }), {
          status: 422,
          headers: { 'content-type': 'application/json' },
        })
      }

      if (url.pathname === '/retry-then-succeed') {
        if (count < 3) {
          return new Response('server error', { status: 500 })
        }
        return Response.json({ ok: true })
      }

      if (url.pathname === '/no-retry-on-400') {
        return new Response('bad request', { status: 400 })
      }

      return Response.json({ ok: true })
    },
  })

  baseURL = `http://localhost:${server.port}`
})

afterAll(() => {
  server.stop()
})

describe('HTTPClient', () => {
  test('sends the request path, query, headers, and body through to xior', async () => {
    const http = new HTTPClient(baseURL)

    await http.post({
      path: ['items', '123'],
      query: { preview: true, page: 2 },
      headers: { 'x-test-header': 'present' },
      body: { name: 'Widget' },
    })

    expect(lastRequest?.method).toBe('POST')
    expect(lastRequest?.path).toBe('/items/123')
    expect(Array.from(new URLSearchParams(lastRequest?.search ?? '').entries())).toEqual([
      ['preview', 'true'],
      ['page', '2'],
    ])
    expect(lastRequest?.headers.get('x-test-header')).toBe('present')
    expect(lastRequest?.body).toEqual({ name: 'Widget' })
  })

  test('turns non-2xx responses into APIError', async () => {
    const http = new HTTPClient(baseURL, { retryTimes: 0 })

    let thrown: APIError | undefined
    try {
      await http.get({ path: ['fail'] })
    } catch (err) {
      if (err instanceof APIError) thrown = err
    }

    expect(thrown).toBeInstanceOf(APIError)
    expect(thrown?.message).toBe('Nope')
    expect(thrown?.statusCode).toBe(422)
    expect(thrown?.url).toBe(`${baseURL}/fail`)
    expect(thrown?.data).toEqual({ message: 'Nope', code: 99 })
  })

  test('retries retryable failures and succeeds once the server recovers', async () => {
    const http = new HTTPClient(baseURL, { retryTimes: 3 })

    const result = await http.get<{ ok: boolean }>({ path: ['retry-then-succeed'] })

    expect(result).toEqual({ ok: true })
    expect(requestCounts['/retry-then-succeed']).toBe(3)
  }, 10_000)

  test('does not retry non-retryable statuses like 400', async () => {
    const http = new HTTPClient(baseURL, { retryTimes: 3 })

    await expect(http.get({ path: ['no-retry-on-400'] })).rejects.toBeInstanceOf(APIError)
    expect(requestCounts['/no-retry-on-400']).toBe(1)
  })

  test('runs the authInterceptor on outgoing requests', async () => {
    const http = new HTTPClient(baseURL, {
      authInterceptor: (config) => ({
        ...config,
        headers: { ...config.headers, authorization: 'Bearer test-token' },
      }),
    })

    await http.get({ path: ['items', '456'] })

    expect(lastRequest?.headers.get('authorization')).toBe('Bearer test-token')
  })

  test('collapses an empty path array to the root path', async () => {
    const http = new HTTPClient(baseURL)

    await http.get({ path: [] })

    expect(lastRequest?.path).toBe('/')
  })

  test('skips empty path segments', async () => {
    const http = new HTTPClient(baseURL)

    await http.get({ path: ['items', '', '123'] })

    expect(lastRequest?.path).toBe('/items/123')
  })
})
