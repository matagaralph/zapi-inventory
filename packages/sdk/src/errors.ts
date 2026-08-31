import { type XiorError } from 'xior'

function hasStringMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  )
}

export class APIError extends Error {
  override name = 'APIError'
  readonly statusCode?: number
  readonly url?: string
  readonly data?: unknown

  constructor(message: string, statusCode?: number, url?: string, cause?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.url = url
    this.data = cause
    Object.setPrototypeOf(this, APIError.prototype)
  }

  static fromXiorError(err: XiorError): APIError {
    const body: unknown = err.response?.data
    const message = hasStringMessage(body) ? body.message : err.message
    const url = (err.config?.baseURL ?? '') + (err.config?.url ?? '')
    return new APIError(message, err.response?.status, url, body)
  }
}

export function isAPIError(err: unknown): err is APIError {
  return err instanceof APIError
}
