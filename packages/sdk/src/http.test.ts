import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { createFetch, createHangingFetch, json } from '../test/fetch.ts'
import type { APIError } from './errors.ts'
import { isAPIError } from './errors.ts'
import type { FetchFunction } from './http.ts'
import { createHTTPClient, sendRequest } from './http.ts'

const baseURL = 'https://api.example.com/inventory/v1'

function isAddressInfo(value: AddressInfo | string | null): value is AddressInfo {
  return value !== null && typeof value === 'object'
}

function streamOf(text: string): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text))
      controller.close()
    },
  })
}

async function captureAPIError(promise: Promise<void>): Promise<APIError> {
  try {
    await promise
  } catch (error) {
    if (isAPIError(error)) return error
    throw error
  }
  throw new Error('expected the request to reject')
}

afterEach(() => {
  vi.useRealTimers()
})

describe('createHTTPClient requests', () => {
  test('sends the method, path, query, headers and JSON body', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(baseURL, { fetch, headers: { 'x-default': 'yes' } })

    await http.post({
      path: ['items', '123'],
      query: { preview: true, page: 2, filter_by: 'Status.All', skipped: undefined },
      headers: { 'x-test-header': 'present' },
      body: { name: 'Widget', rate: 12.5 },
    })

    const [request] = requests
    const url = new URL(request?.url ?? '')
    expect(request?.method).toBe('POST')
    expect(url.origin + url.pathname).toBe(`${baseURL}/items/123`)
    expect(Array.from(url.searchParams.entries())).toEqual([
      ['preview', 'true'],
      ['page', '2'],
      ['filter_by', 'Status.All'],
    ])
    expect(request?.headers.get('x-test-header')).toBe('present')
    expect(request?.headers.get('x-default')).toBe('yes')
    expect(request?.headers.get('content-type')).toBe('application/json')
    expect(await request?.json()).toEqual({ name: 'Widget', rate: 12.5 })
  })

  test.each(['get', 'post', 'put', 'patch', 'delete'] as const)(
    'exposes %s with the matching HTTP method',
    async (method) => {
      const { fetch, requests } = createFetch(() => json({ ok: true }))
      const http = createHTTPClient(baseURL, { fetch })

      await http[method]({ path: ['items'] })

      expect(requests[0]?.method).toBe(method.toUpperCase())
    }
  )

  test('percent-encodes query keys and values', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(baseURL, { fetch })

    await http.get({ path: ['items'], query: { search_text: 'solar panel & co', 'a b': 'x' } })

    expect(new URL(requests[0]?.url ?? '').search).toBe(
      '?search_text=solar%20panel%20%26%20co&a%20b=x'
    )
  })

  test('collapses an empty path array to the root path', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(baseURL, { fetch })

    await http.get({ path: [] })

    expect(requests[0]?.url).toBe(`${baseURL}/`)
  })

  test('skips empty path segments', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(`${baseURL}/`, { fetch })

    await http.get({ path: ['items', '', '123'] })

    expect(requests[0]?.url).toBe(`${baseURL}/items/123`)
  })

  test('never sends a body with GET', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(baseURL, { fetch })

    await http.get({ path: ['items'], body: { ignored: true } })

    expect(requests[0]?.body).toBeNull()
    expect(requests[0]?.headers.has('content-type')).toBe(false)
  })

  test('sends no body or content type when there is no payload', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(baseURL, { fetch })

    await http.post({ path: ['items', '1', 'active'] })

    expect(requests[0]?.body).toBeNull()
    expect(requests[0]?.headers.has('content-type')).toBe(false)
  })

  test('sends a JSON body with DELETE', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(baseURL, { fetch })

    await http.delete({ path: ['items'], body: { item_ids: ['1', '2'] } })

    expect(await requests[0]?.json()).toEqual({ item_ids: ['1', '2'] })
  })

  test('keeps a caller-supplied content type, whatever its casing', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(baseURL, { fetch })

    await http.post({
      path: ['items'],
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: { name: 'Widget' },
    })

    expect(requests[0]?.headers.get('content-type')).toBe('application/json; charset=utf-8')
  })

  test('sends FormData as multipart without overriding the boundary', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(baseURL, { fetch })
    const body = new FormData()
    body.append('image', new Blob(['png-bytes'], { type: 'image/png' }), 'item.png')

    await http.post({ path: ['items', '1', 'image'], body })

    expect(requests[0]?.headers.get('content-type')).toMatch(/^multipart\/form-data; boundary=/)
    const received = await requests[0]?.formData()
    const image = received?.get('image')
    expect(image).toBeInstanceOf(Blob)
    expect(image instanceof Blob ? await image.text() : undefined).toBe('png-bytes')
  })

  test('sends URLSearchParams form encoded', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(baseURL, { fetch })

    await http.post({ path: ['form'], body: new URLSearchParams({ a: '1', b: 'two words' }) })

    expect(requests[0]?.headers.get('content-type')).toBe('application/x-www-form-urlencoded')
    expect(await requests[0]?.text()).toBe('a=1&b=two+words')
  })
})

describe('createHTTPClient responses', () => {
  test('resolves to the parsed JSON body', async () => {
    const { fetch } = createFetch(() => json({ item: { item_id: '1' } }))
    const http = createHTTPClient(baseURL, { fetch })

    await expect(http.get({ path: ['items', '1'] })).resolves.toEqual({ item: { item_id: '1' } })
  })

  test('resolves to undefined for 204 and empty 200 responses', async () => {
    const { fetch } = createFetch((_request, call) =>
      call === 1 ? new Response(null, { status: 204 }) : new Response('', { status: 200 })
    )
    const http = createHTTPClient(baseURL, { fetch })

    await expect(http.delete({ path: ['items', '1'] })).resolves.toBeUndefined()
    await expect(http.post({ path: ['items', '1', 'active'] })).resolves.toBeUndefined()
  })

  test('resolves to the raw text when a body is not JSON', async () => {
    const { fetch } = createFetch(
      () => new Response('plain text', { headers: { 'content-type': 'text/plain' } })
    )
    const http = createHTTPClient(baseURL, { fetch })

    await expect(http.get({ path: ['text'] })).resolves.toBe('plain text')
  })

  test('parses JSON sent without a content type', async () => {
    const { fetch } = createFetch(() => new Response('{"ok":true}'))
    const http = createHTTPClient(baseURL, { fetch })

    await expect(http.get({ path: ['untyped'] })).resolves.toEqual({ ok: true })
  })

  /**
   * xior read every successful body as text, so binary downloads typed as `Blob` (item images,
   * attachments, documents) resolved to a corrupted string instead.
   */
  test('resolves binary downloads to a Blob', async () => {
    const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff])
    const { fetch } = createFetch(
      () => new Response(bytes, { headers: { 'content-type': 'image/png' } })
    )
    const http = createHTTPClient(baseURL, { fetch })

    const result = await http.get<Blob>({ path: ['items', '1', 'image'] })

    expect(result).toBeInstanceOf(Blob)
    expect(new Uint8Array(await result.arrayBuffer())).toEqual(bytes)
  })
})

describe('createHTTPClient errors', () => {
  test('turns non-2xx responses into APIError using Zoho’s message', async () => {
    const { fetch } = createFetch(() => json({ code: 1002, message: 'Item does not exist.' }, 404))
    const http = createHTTPClient(baseURL, { fetch, retryTimes: 0 })

    const error = await captureAPIError(http.get({ path: ['items', '9'], query: { a: 1 } }))

    expect(error.message).toBe('Item does not exist.')
    expect(error.statusCode).toBe(404)
    expect(error.url).toBe(`${baseURL}/items/9`)
    expect(error.data).toEqual({ code: 1002, message: 'Item does not exist.' })
    expect(error.stack).toBeTypeOf('string')
  })

  test('falls back to the status message for non-JSON error bodies', async () => {
    const { fetch } = createFetch(
      () =>
        new Response('<html>Bad Gateway</html>', {
          status: 400,
          headers: { 'content-type': 'text/html' },
        })
    )
    const http = createHTTPClient(baseURL, { fetch })

    const error = await captureAPIError(http.get({ path: ['items'] }))

    expect(error.message).toBe('Request failed with status code 400')
    expect(error.statusCode).toBe(400)
    expect(error.data).toBe('<html>Bad Gateway</html>')
  })

  test('falls back to the status message when the body message is not a string', async () => {
    const { fetch } = createFetch(() => json({ message: 12345 }, 400))
    const http = createHTTPClient(baseURL, { fetch })

    const error = await captureAPIError(http.get({ path: ['items'] }))

    expect(error.message).toBe('Request failed with status code 400')
  })

  test('keeps an empty error body as undefined data', async () => {
    const { fetch } = createFetch(() => new Response(null, { status: 401 }))
    const http = createHTTPClient(baseURL, { fetch })

    const error = await captureAPIError(http.get({ path: ['items'] }))

    expect(error.statusCode).toBe(401)
    expect(error.data).toBeUndefined()
  })

  test('wraps transport failures in APIError and keeps the cause', async () => {
    const cause = new TypeError('fetch failed')
    const { fetch } = createFetch(() => Promise.reject(cause))
    const http = createHTTPClient(baseURL, { fetch })

    const error = await captureAPIError(http.get({ path: ['items'] }))

    expect(error.message).toBe('fetch failed')
    expect(error.statusCode).toBeUndefined()
    expect(error.url).toBe(`${baseURL}/items`)
    expect(error.cause).toBe(cause)
  })

  test('does not retry transport failures', async () => {
    const { fetch, requests } = createFetch(() => Promise.reject(new TypeError('fetch failed')))
    const http = createHTTPClient(baseURL, { fetch })

    await expect(http.get({ path: ['items'] })).rejects.toSatisfy(isAPIError)
    expect(requests).toHaveLength(1)
  })
})

describe('createHTTPClient timeouts', () => {
  /**
   * xior let `timeout: undefined` on each request overwrite the client timeout, so the
   * documented 10 second default never applied and requests could hang indefinitely.
   */
  test('aborts after the default 10 second timeout', async () => {
    vi.useFakeTimers()
    const { fetch } = createHangingFetch()
    const http = createHTTPClient(baseURL, { fetch })

    const pending = captureAPIError(http.get({ path: ['slow'] }))
    await vi.advanceTimersByTimeAsync(9_999)
    let settled = false
    void pending.then(() => {
      settled = true
    })
    await Promise.resolve()
    expect(settled).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    const error = await pending
    expect(error.message).toBe('timeout of 10000ms exceeded')
    expect(error.statusCode).toBeUndefined()
    expect(error.url).toBe(`${baseURL}/slow`)
  })

  test('uses the client timeout, and the request timeout over it', async () => {
    vi.useFakeTimers()
    const { fetch } = createHangingFetch()
    const http = createHTTPClient(baseURL, { fetch, timeout: 2_000 })

    const clientTimeout = captureAPIError(http.get({ path: ['slow'] }))
    const requestTimeout = captureAPIError(http.get({ path: ['slow'], timeout: 500 }))
    await vi.advanceTimersByTimeAsync(2_000)

    expect((await requestTimeout).message).toBe('timeout of 500ms exceeded')
    expect((await clientTimeout).message).toBe('timeout of 2000ms exceeded')
  })

  test('clears the timer once the response is read', async () => {
    vi.useFakeTimers()
    const { fetch } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(baseURL, { fetch })

    await http.get({ path: ['items'] })

    expect(vi.getTimerCount()).toBe(0)
  })

  test('does not retry timeouts', async () => {
    vi.useFakeTimers()
    const { fetch, requests } = createHangingFetch()
    const http = createHTTPClient(baseURL, { fetch, timeout: 100 })

    const pending = captureAPIError(http.get({ path: ['slow'] }))
    await vi.advanceTimersByTimeAsync(100)

    expect((await pending).message).toBe('timeout of 100ms exceeded')
    expect(requests).toHaveLength(1)
  })
})

describe('createHTTPClient retries', () => {
  test('retries 5xx responses after one second and resolves once the server recovers', async () => {
    vi.useFakeTimers()
    const { fetch, requests } = createFetch((_request, call) =>
      call < 3 ? new Response('server error', { status: 500 }) : json({ ok: true })
    )
    const http = createHTTPClient(baseURL, { fetch })

    const pending = http.get({ path: ['flaky'] })
    await vi.advanceTimersByTimeAsync(999)
    expect(requests).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(requests).toHaveLength(2)
    await vi.advanceTimersByTimeAsync(1_000)

    await expect(pending).resolves.toEqual({ ok: true })
    expect(requests).toHaveLength(3)
  })

  test('retries 429 responses', async () => {
    vi.useFakeTimers()
    const { fetch, requests } = createFetch((_request, call) =>
      call === 1 ? json({ message: 'Too many requests' }, 429) : json({ ok: true })
    )
    const http = createHTTPClient(baseURL, { fetch })

    const pending = http.get({ path: ['busy'] })
    await vi.advanceTimersByTimeAsync(1_000)

    await expect(pending).resolves.toEqual({ ok: true })
    expect(requests).toHaveLength(2)
  })

  test('gives up after three retries by default and rejects with the last error', async () => {
    vi.useFakeTimers()
    const { fetch, requests } = createFetch(() => json({ message: 'Down' }, 503))
    const http = createHTTPClient(baseURL, { fetch })

    const pending = captureAPIError(http.get({ path: ['down'] }))
    await vi.advanceTimersByTimeAsync(3_000)

    const error = await pending
    expect(error.statusCode).toBe(503)
    expect(error.message).toBe('Down')
    expect(requests).toHaveLength(4)
  })

  test('honours retryTimes', async () => {
    vi.useFakeTimers()
    const { fetch, requests } = createFetch(() => json({ message: 'Down' }, 500))
    const http = createHTTPClient(baseURL, { fetch, retryTimes: 1 })

    const pending = captureAPIError(http.get({ path: ['down'] }))
    await vi.advanceTimersByTimeAsync(1_000)

    expect((await pending).statusCode).toBe(500)
    expect(requests).toHaveLength(2)
  })

  test('does not retry other 4xx statuses', async () => {
    const { fetch, requests } = createFetch(() => new Response('bad request', { status: 400 }))
    const http = createHTTPClient(baseURL, { fetch })

    await expect(http.get({ path: ['bad'] })).rejects.toSatisfy(isAPIError)
    expect(requests).toHaveLength(1)
  })

  /**
   * Every method used to be retried on 5xx, so a create or email Zoho had already applied before
   * failing could run up to four times. 429 means Zoho rejected the request unprocessed, so it
   * stays retryable for every method.
   *
   * @see https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2
   */
  test.each(['post', 'patch'] as const)('does not retry %s on 5xx', async (method) => {
    const { fetch, requests } = createFetch(() => json({ message: 'Down' }, 500))
    const http = createHTTPClient(baseURL, { fetch })

    const error = await captureAPIError(http[method]({ path: ['salesorders'], body: { a: 1 } }))

    expect(error.statusCode).toBe(500)
    expect(requests).toHaveLength(1)
  })

  test.each(['get', 'put', 'delete'] as const)('retries %s on 5xx', async (method) => {
    vi.useFakeTimers()
    const { fetch, requests } = createFetch((_request, call) =>
      call === 1 ? json({ message: 'Down' }, 503) : json({ ok: true })
    )
    const http = createHTTPClient(baseURL, { fetch })

    const pending = http[method]({ path: ['salesorders', '1'] })
    await vi.advanceTimersByTimeAsync(1_000)

    await expect(pending).resolves.toEqual({ ok: true })
    expect(requests).toHaveLength(2)
  })

  test.each(['post', 'patch'] as const)('retries %s on 429', async (method) => {
    vi.useFakeTimers()
    const { fetch, requests } = createFetch((_request, call) =>
      call === 1 ? json({ message: 'Too many requests' }, 429) : json({ ok: true })
    )
    const http = createHTTPClient(baseURL, { fetch })

    const pending = http[method]({ path: ['salesorders'], body: { a: 1 } })
    await vi.advanceTimersByTimeAsync(1_000)

    await expect(pending).resolves.toEqual({ ok: true })
    expect(requests).toHaveLength(2)
  })

  test('disables retries with retryTimes 0', async () => {
    const { fetch, requests } = createFetch(() => json({ message: 'Too many requests' }, 429))
    const http = createHTTPClient(baseURL, { fetch, retryTimes: 0 })

    expect((await captureAPIError(http.get({ path: ['items'] }))).statusCode).toBe(429)
    expect(requests).toHaveLength(1)
  })

  test('resends the same JSON and FormData bodies on every attempt', async () => {
    vi.useFakeTimers()
    const { fetch, requests } = createFetch((_request, call) =>
      call % 2 === 1 ? json({ message: 'Too many requests' }, 429) : json({ ok: true })
    )
    const http = createHTTPClient(baseURL, { fetch })
    const form = new FormData()
    form.append('attachment', new Blob(['file-bytes']), 'file.txt')

    const jsonRequest = http.post({ path: ['json'], body: { name: 'Widget' } })
    await vi.advanceTimersByTimeAsync(1_000)
    await jsonRequest
    const formRequest = http.post({ path: ['form'], body: form })
    await vi.advanceTimersByTimeAsync(1_000)
    await formRequest

    expect(await requests[0]?.json()).toEqual({ name: 'Widget' })
    expect(await requests[1]?.json()).toEqual({ name: 'Widget' })
    for (const request of requests.slice(2)) {
      const file = (await request.formData()).get('attachment')
      expect(file instanceof Blob ? await file.text() : undefined).toBe('file-bytes')
    }
  })

  /**
   * Node's fetch refuses a ReadableStream body unless the request sets `duplex: 'half'`, so
   * stream uploads failed with a TypeError before anything was sent.
   *
   * @see https://fetch.spec.whatwg.org/#dom-requestinit-duplex
   */
  test('sends stream bodies through native Request construction', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    const http = createHTTPClient(baseURL, { fetch })

    await expect(http.post({ path: ['stream'], body: streamOf('chunk') })).resolves.toEqual({
      ok: true,
    })
    expect(await requests[0]?.text()).toBe('chunk')
  })

  test('uploads stream bodies with native fetch', async () => {
    const server = createServer((request, response) => {
      const chunks: Uint8Array[] = []
      request.on('data', (chunk: Uint8Array) => chunks.push(chunk))
      request.on('end', () => {
        response.setHeader('content-type', 'application/json')
        response.end(JSON.stringify({ received: Buffer.concat(chunks).toString() }))
      })
    })
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
    try {
      const address = server.address()
      if (!isAddressInfo(address)) throw new Error('server is not listening on a port')
      const http = createHTTPClient(`http://127.0.0.1:${address.port}`)

      await expect(
        http.post({ path: ['upload'], body: streamOf('first,'), headers: {} })
      ).resolves.toEqual({ received: 'first,' })
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()))
    }
  })

  test('does not retry a stream body that the first attempt consumed', async () => {
    let calls = 0
    const fetch: FetchFunction = async () => {
      calls += 1
      return json({ message: 'Too many requests' }, 429)
    }
    const http = createHTTPClient(baseURL, { fetch })
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('chunk'))
        controller.close()
      },
    })

    const error = await captureAPIError(http.post({ path: ['stream'], body }))

    expect(error.statusCode).toBe(429)
    expect(calls).toBe(1)
  })

  test('runs the auth interceptor before every attempt', async () => {
    vi.useFakeTimers()
    const { fetch, requests } = createFetch((_request, call) =>
      call === 1 ? json({ message: 'Down' }, 500) : json({ ok: true })
    )
    let token = 0
    const http = createHTTPClient(baseURL, {
      fetch,
      authInterceptor: (config) => {
        token += 1
        config.headers['Authorization'] = `Bearer token-${token}`
        config.params['organization_id'] = 'org-1'
        return config
      },
    })

    const pending = http.get({ path: ['items'], query: { page: 1 } })
    await vi.advanceTimersByTimeAsync(1_000)
    await pending

    expect(requests.map((request) => request.headers.get('authorization'))).toEqual([
      'Bearer token-1',
      'Bearer token-2',
    ])
    expect(new URL(requests[1]?.url ?? '').search).toBe('?page=1&organization_id=org-1')
  })

  test('does not retry a failing auth interceptor', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    let attempts = 0
    const http = createHTTPClient(baseURL, {
      fetch,
      authInterceptor: () => {
        attempts += 1
        throw new Error('no token')
      },
    })

    await expect(http.get({ path: ['items'] })).rejects.toThrow('no token')
    expect(attempts).toBe(1)
    expect(requests).toHaveLength(0)
  })
})

describe('sendRequest', () => {
  test('uses globalThis.fetch when no fetch is supplied', async () => {
    const { fetch, requests } = createFetch(() => json({ ok: true }))
    vi.stubGlobal('fetch', fetch)
    try {
      await expect(sendRequest({ method: 'GET', url: `${baseURL}/items` })).resolves.toEqual({
        ok: true,
      })
    } finally {
      vi.unstubAllGlobals()
    }
    expect(requests).toHaveLength(1)
  })

  test('applies no timeout unless one is given', async () => {
    vi.useFakeTimers()
    const { fetch } = createFetch(() => json({ ok: true }))

    const pending = sendRequest({ method: 'GET', url: `${baseURL}/items`, fetch })
    expect(vi.getTimerCount()).toBe(0)
    await expect(pending).resolves.toEqual({ ok: true })
  })
})
