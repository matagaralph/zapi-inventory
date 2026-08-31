import { describe, expect, test } from 'bun:test'
import { XiorError, type XiorResponse } from 'xior'
import { APIError, isAPIError } from './errors.ts'

function fakeXiorError(status: number, cause: unknown): XiorError {
  const requestConfig = { headers: {}, params: {}, url: '/items/123', method: 'GET' }
  const response: XiorResponse = {
    data: cause,
    status,
    statusText: '',
    headers: new Headers(),
    response: new Response(),
    request: requestConfig,
    config: requestConfig,
  }
  const err = new XiorError(`Request failed with status code ${status}`, undefined, response)
  err.config = { baseURL: 'https://api.example.com', url: '/items/123' }
  return err
}

describe('isAPIError', () => {
  test('true for APIError instances', () => {
    expect(isAPIError(new APIError('boom'))).toBe(true)
  })

  test('false for plain errors and non-errors', () => {
    expect(isAPIError(new Error('boom'))).toBe(false)
    expect(isAPIError('boom')).toBe(false)
    expect(isAPIError(undefined)).toBe(false)
  })
})

describe('APIError.fromXiorError', () => {
  test('uses the response body message when present', () => {
    const err = fakeXiorError(422, { message: 'Item not found', code: 1002 })
    const apiError = APIError.fromXiorError(err)

    expect(apiError.message).toBe('Item not found')
    expect(apiError.statusCode).toBe(422)
    expect(apiError.url).toBe('https://api.example.com/items/123')
    expect(apiError.data).toEqual({ message: 'Item not found', code: 1002 })
  })

  test('falls back to the xior error message when the body has no string message', () => {
    const err = fakeXiorError(500, { message: 12345 })
    const apiError = APIError.fromXiorError(err)

    expect(apiError.message).toBe(err.message)
  })

  test('falls back to the xior error message when the body is not an object', () => {
    const err = fakeXiorError(500, 'internal error')
    const apiError = APIError.fromXiorError(err)

    expect(apiError.message).toBe(err.message)
  })

  test('is itself recognized by isAPIError', () => {
    const apiError = APIError.fromXiorError(fakeXiorError(400, { message: 'bad request' }))
    expect(isAPIError(apiError)).toBe(true)
  })

  test('handles network failures that never produced a response', () => {
    const err = new XiorError('Network Error')
    err.config = { baseURL: 'https://api.example.com', url: '/items/123' }

    const apiError = APIError.fromXiorError(err)

    expect(apiError.message).toBe('Network Error')
    expect(apiError.statusCode).toBeUndefined()
    expect(apiError.url).toBe('https://api.example.com/items/123')
    expect(apiError.data).toBeUndefined()
  })
})
