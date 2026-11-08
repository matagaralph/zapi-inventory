import type { APIError } from './errors.ts'
import { createAPIError, isAPIError } from './errors.ts'

const DEFAULT_TIMEOUT_MS = 10_000
const DEFAULT_RETRY_TIMES = 3
const RETRY_INTERVAL_MS = 1000

const JSON_CONTENT_TYPE = 'application/json'
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded'
const TEXTUAL_CONTENT_TYPE = /json|xml|javascript|x-www-form-urlencoded|^text\//i

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * A `fetch`-compatible function. Typed as a plain function rather than `typeof fetch` so a
 * wrapper works in every runtime, including Bun, whose `fetch` type has extra members.
 */
export type FetchFunction = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

/** Query string parameters. `undefined` values are omitted from the URL. */
export type QueryParams = Record<string, string | number | boolean | undefined>

type NativeBody = NonNullable<RequestInit['body']>

/** `duplex` is required by Node's fetch for stream bodies but missing from the DOM typings. */
type StreamingRequestInit = RequestInit & { duplex?: 'half' }

/** Any value `JSON.parse` can produce. */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

/**
 * A decoded response body: parsed JSON, text that is not valid JSON, a `Blob` for binary
 * downloads, or `undefined` when the response has no body.
 */
export type ResponseBody = JSONValue | Blob | undefined

/** A request against the Zoho Inventory API, relative to the SDK's base URL. */
export interface ApiRequest {
  /**
   * Path segments, each percent-encoded and joined with `/`. Empty segments are skipped, and
   * `.` or `..` segments are rejected.
   */
  path: string[]
  query?: QueryParams
  /**
   * The request payload. `FormData`, `URLSearchParams`, `Blob`, binary data, streams and strings
   * are sent as they are. Anything else is serialised as JSON.
   */
  body?: unknown
  headers?: Record<string, string>
  /** Milliseconds before this request is aborted. Overrides the client's timeout. */
  timeout?: number
}

/** The parts of an outgoing request an {@link AuthInterceptor} may change. */
export interface RequestConfig {
  headers: Record<string, string>
  params: QueryParams
}

/** Runs before every attempt of every request, including retries. */
export type AuthInterceptor = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig

export interface HTTPClientOptions {
  /** Milliseconds before a request is aborted. Defaults to `10000`, and `0` disables the timeout. */
  timeout?: number
  /** Headers sent with every request. */
  headers?: Record<string, string>
  /**
   * How many times a failed request is retried, one second apart. `429` responses are retried
   * for every method, but `5xx` responses only for `GET`, `PUT` and `DELETE`, because a `POST`
   * or `PATCH` may already have been applied. Defaults to `3`, and `0` disables retries.
   */
  retryTimes?: number
  authInterceptor?: AuthInterceptor
  /** The `fetch` implementation to use. Defaults to `globalThis.fetch`. */
  fetch?: FetchFunction
}

/**
 * Sends authenticated requests to the Zoho Inventory API. Each method resolves to the decoded
 * response body. `T` is not validated at runtime.
 */
export interface HTTPClient {
  get<T = unknown>(request: ApiRequest): Promise<T>
  post<T = unknown>(request: ApiRequest): Promise<T>
  put<T = unknown>(request: ApiRequest): Promise<T>
  patch<T = unknown>(request: ApiRequest): Promise<T>
  delete<T = unknown>(request: ApiRequest): Promise<T>
}

export interface TransportRequest {
  method: HTTPMethod
  /** The absolute URL, without the query string. */
  url: string
  query?: QueryParams
  headers?: Record<string, string>
  body?: unknown
  /** Milliseconds before the exchange is aborted. Missing or `0` disables the timeout. */
  timeout?: number
  fetch?: FetchFunction
}

// Each segment is percent-encoded so a resource ID can never add segments, a query string or a
// fragment (which would hide the organization_id the client appends). `.` and `..` survive
// encoding and are resolved by URL parsing, so they are rejected outright.
function buildPath(segments: string[]): string {
  let path = ''
  for (const segment of segments) {
    if (!segment) continue
    if (segment === '.' || segment === '..') {
      throw createAPIError(`Invalid path segment "${segment}"`)
    }
    path += `/${encodeURIComponent(segment)}`
  }
  return path || '/'
}

function buildURL(url: string, query: QueryParams | undefined): string {
  const pairs: string[] = []
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null) continue
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  }
  if (pairs.length === 0) return url
  return `${url}${url.includes('?') ? '&' : '?'}${pairs.join('&')}`
}

function isTextBody(value: unknown): value is string {
  return typeof value === 'string'
}

// Payloads fetch sends untouched, setting its own content type (multipart boundary included).
function isBinaryBody(value: unknown): value is NativeBody {
  return (
    value instanceof FormData ||
    value instanceof URLSearchParams ||
    value instanceof Blob ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    (typeof ReadableStream !== 'undefined' && value instanceof ReadableStream)
  )
}

// A stream is consumed by the first attempt, so a request carrying one cannot be retried.
function isStreamBody(value: unknown): value is ReadableStream {
  return typeof ReadableStream !== 'undefined' && value instanceof ReadableStream
}

function prepareBody(request: TransportRequest, headers: Headers): NativeBody | undefined {
  const { body } = request
  if (body === undefined || request.method === 'GET') return undefined

  if (body instanceof URLSearchParams) {
    headers.set('content-type', FORM_CONTENT_TYPE)
    return body
  }
  if (isBinaryBody(body)) return body

  // Strings are taken to be serialised JSON already.
  if (!headers.has('content-type')) headers.set('content-type', JSON_CONTENT_TYPE)
  return isTextBody(body) ? body : JSON.stringify(body)
}

async function readBody(response: Response): Promise<ResponseBody> {
  if (response.status === 204 || response.status === 205 || response.status === 304) {
    return undefined
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (response.ok && contentType && !TEXTUAL_CONTENT_TYPE.test(contentType)) {
    return response.blob()
  }

  const text = await response.text()
  if (!text) return undefined
  try {
    // SAFETY: JSON.parse only ever produces values described by JSONValue.
    return JSON.parse(text) as JSONValue
  } catch {
    return text
  }
}

function hasStringMessage(value: ResponseBody): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  )
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Performs one HTTP exchange and resolves to the decoded body. Non-2xx responses, timeouts and
 * transport failures all reject with an `APIError`. The timeout covers reading the body too.
 */
export async function sendRequest<T>(request: TransportRequest): Promise<T> {
  const fetchImpl = request.fetch ?? globalThis.fetch
  const headers = new Headers(request.headers)
  const body = prepareBody(request, headers)
  const { url, timeout } = request

  const controller = new AbortController()
  let timedOut = false
  const timer =
    timeout && timeout > 0
      ? setTimeout(() => {
          timedOut = true
          controller.abort()
        }, timeout)
      : undefined

  try {
    const init: StreamingRequestInit = {
      method: request.method,
      headers,
      body,
      signal: controller.signal,
    }
    if (isStreamBody(body)) init.duplex = 'half'
    const response = await fetchImpl(buildURL(url, request.query), init)
    const data = await readBody(response)

    if (!response.ok) {
      const fallback = `Request failed with status code ${response.status}`
      throw createAPIError(hasStringMessage(data) ? data.message : fallback, {
        statusCode: response.status,
        url,
        data,
      })
    }

    // SAFETY: response bodies are not validated at runtime. Callers choose T to describe what
    // the endpoint documents, and the public API states that generic types are unchecked.
    return data as T
  } catch (error) {
    if (isAPIError(error)) throw error
    if (timedOut) {
      throw createAPIError(`timeout of ${timeout}ms exceeded`, { url, cause: error })
    }
    const message = error instanceof Error ? error.message : 'Network error'
    throw createAPIError(message, { url, cause: error })
  } finally {
    clearTimeout(timer)
  }
}

const IDEMPOTENT_METHODS: ReadonlySet<HTTPMethod> = new Set(['GET', 'PUT', 'DELETE'])

// 429 means Zoho rejected the request without processing it, so any method may be retried. A
// 5xx may arrive after Zoho applied the change, so only idempotent methods retry on it.
function isRetryableAPIError(error: unknown, method: HTTPMethod): error is APIError {
  if (!isAPIError(error) || error.statusCode === undefined) return false
  if (error.statusCode === 429) return true
  return error.statusCode >= 500 && IDEMPOTENT_METHODS.has(method)
}

/**
 * Creates an HTTP client bound to `baseURL`. `429` responses, and `5xx` responses to idempotent
 * methods, are retried after a one-second pause. Every other failure rejects immediately.
 */
export function createHTTPClient(baseURL: string, options: HTTPClientOptions = {}): HTTPClient {
  const root = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
  const retryTimes = options.retryTimes ?? DEFAULT_RETRY_TIMES

  async function request<T>(method: HTTPMethod, req: ApiRequest): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      // The interceptor runs outside the retry guard, so a failure to authenticate is never
      // retried, and every retry picks up a fresh token.
      let config: RequestConfig = {
        headers: { ...options.headers, ...req.headers },
        params: { ...req.query },
      }
      if (options.authInterceptor) config = await options.authInterceptor(config)

      try {
        return await sendRequest<T>({
          method,
          url: `${root}${buildPath(req.path)}`,
          query: config.params,
          headers: config.headers,
          body: req.body,
          timeout: req.timeout ?? options.timeout ?? DEFAULT_TIMEOUT_MS,
          fetch: options.fetch,
        })
      } catch (error) {
        if (
          attempt >= retryTimes ||
          !isRetryableAPIError(error, method) ||
          isStreamBody(req.body)
        ) {
          throw error
        }
        await delay(RETRY_INTERVAL_MS)
      }
    }
  }

  return {
    get: <T>(req: ApiRequest) => request<T>('GET', req),
    post: <T>(req: ApiRequest) => request<T>('POST', req),
    put: <T>(req: ApiRequest) => request<T>('PUT', req),
    patch: <T>(req: ApiRequest) => request<T>('PATCH', req),
    delete: <T>(req: ApiRequest) => request<T>('DELETE', req),
  }
}
