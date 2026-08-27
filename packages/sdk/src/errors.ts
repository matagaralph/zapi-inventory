import { type XiorError } from 'xior'

export class APIError extends Error {
  override name = 'APIError'
  readonly statusCode?: number
  readonly url?: string
  readonly data?: Record<string, unknown>

  constructor(message: string, statusCode?: number, url?: string, data?: Record<string, unknown>) {
    super(message)
    this.statusCode = statusCode
    this.url = url
    this.data = data
    Object.setPrototypeOf(this, APIError.prototype)
  }

  static fromXiorError(err: XiorError): APIError {
    const body = err.response?.data as Record<string, unknown> | undefined
    const message = typeof body?.message === 'string' ? body.message : err.message
    const url = (err.config?.baseURL ?? '') + (err.config?.url ?? '')
    return new APIError(message, err.response?.status, url, body)
  }
}

export function isAPIError(err: unknown): err is APIError {
  return err instanceof APIError
}
