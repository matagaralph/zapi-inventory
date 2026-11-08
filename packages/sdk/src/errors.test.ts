import { describe, expect, test } from 'vitest'
import { createAPIError, isAPIError } from './errors.ts'

describe('createAPIError', () => {
  test('creates a native Error carrying the SDK metadata', () => {
    const error = createAPIError('Item not found', {
      statusCode: 404,
      url: 'https://www.zohoapis.com/inventory/v1/items/123',
      data: { code: 1002, message: 'Item not found' },
    })

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('APIError')
    expect(error.message).toBe('Item not found')
    expect(error.statusCode).toBe(404)
    expect(error.url).toBe('https://www.zohoapis.com/inventory/v1/items/123')
    expect(error.data).toEqual({ code: 1002, message: 'Item not found' })
    expect(error.stack).toContain('Item not found')
  })

  test('leaves metadata undefined when the request never produced a response', () => {
    const cause = new TypeError('fetch failed')
    const error = createAPIError('fetch failed', { url: 'https://example.com/items', cause })

    expect(error.statusCode).toBeUndefined()
    expect(error.data).toBeUndefined()
    expect(error.cause).toBe(cause)
  })

  test('omits cause when none is given', () => {
    expect('cause' in createAPIError('boom')).toBe(false)
  })

  test('formats like a native error', () => {
    expect(String(createAPIError('boom'))).toBe('APIError: boom')
  })
})

describe('isAPIError', () => {
  test('true for errors created by createAPIError', () => {
    expect(isAPIError(createAPIError('boom'))).toBe(true)
  })

  test('true for errors branded by another copy of the SDK', () => {
    const foreign = new Error('boom')
    Object.defineProperty(foreign, Symbol.for('zapi-inventory.APIError'), { value: true })

    expect(isAPIError(foreign)).toBe(true)
  })

  test('false for lookalikes, plain errors and non-errors', () => {
    const lookalike = Object.assign(new Error('boom'), { name: 'APIError', statusCode: 500 })

    expect(isAPIError(lookalike)).toBe(false)
    expect(isAPIError({ name: 'APIError', message: 'boom' })).toBe(false)
    expect(isAPIError(new Error('boom'))).toBe(false)
    expect(isAPIError('boom')).toBe(false)
    expect(isAPIError(null)).toBe(false)
    expect(isAPIError(undefined)).toBe(false)
  })
})
