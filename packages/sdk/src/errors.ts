// A registered symbol survives duplicate SDK copies (ESM and CJS builds loaded side by side) and
// other realms, which an `instanceof` check against a single constructor would not.
const API_ERROR_BRAND = Symbol.for('zapi-inventory.APIError')

/** Metadata attached to every {@link APIError}. */
export interface APIErrorDetails {
  /** The HTTP status code, when the request reached the server. */
  statusCode?: number
  /** The full request URL, without the query string. */
  url?: string
  /** The raw response body, if any. */
  data?: unknown
  /** The underlying failure, such as a network or timeout error. */
  cause?: unknown
}

/**
 * A native `Error` describing a failed SDK request: a non-2xx response, an invalid OAuth token
 * response, a timeout, or a transport failure. Narrow unknown errors with {@link isAPIError}.
 */
export interface APIError extends Error {
  readonly name: 'APIError'
  readonly statusCode?: number
  readonly url?: string
  readonly data?: unknown
}

/**
 * Creates an {@link APIError}. The result is a plain `Error` instance with SDK metadata, so it
 * keeps a native stack trace and works with any error reporting tool.
 */
export function createAPIError(message: string, details: APIErrorDetails = {}): APIError {
  const error =
    details.cause === undefined ? new Error(message) : new Error(message, { cause: details.cause })
  Object.defineProperty(error, API_ERROR_BRAND, { value: true })

  return Object.assign(error, {
    name: 'APIError' as const,
    statusCode: details.statusCode,
    url: details.url,
    data: details.data,
  })
}

/** Returns `true` when `error` is an {@link APIError} created by any copy of this SDK. */
export function isAPIError(error: unknown): error is APIError {
  return error instanceof Error && API_ERROR_BRAND in error && error[API_ERROR_BRAND] === true
}
