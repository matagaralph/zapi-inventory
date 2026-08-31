import { describe, expect, test } from 'bun:test'
import { isFresh, isTokenRefreshResponse } from './oauth.ts'

describe('isFresh', () => {
  test('true when the token has time remaining beyond the expiry buffer', () => {
    expect(isFresh({ accessToken: 'abc', expiresAt: Date.now() + 10 * 60 * 1000 })).toBe(true)
  })

  test('false when the token falls within the expiry buffer', () => {
    expect(isFresh({ accessToken: 'abc', expiresAt: Date.now() + 60 * 1000 })).toBe(false)
  })

  test('false when the token is already expired', () => {
    expect(isFresh({ accessToken: 'abc', expiresAt: Date.now() - 1000 })).toBe(false)
  })

  test('false for null', () => {
    expect(isFresh(null)).toBe(false)
  })

  test('false when accessToken is empty', () => {
    expect(isFresh({ accessToken: '', expiresAt: Date.now() + 10 * 60 * 1000 })).toBe(false)
  })

  test('false when expiresAt is zero', () => {
    expect(isFresh({ accessToken: 'abc', expiresAt: 0 })).toBe(false)
  })
})

describe('isTokenRefreshResponse', () => {
  test('true when access_token is a string', () => {
    expect(isTokenRefreshResponse({ access_token: 'tok' })).toBe(true)
  })

  test('true when expires_in is also present', () => {
    expect(isTokenRefreshResponse({ access_token: 'tok', expires_in: 3600 })).toBe(true)
  })

  test('false when access_token is missing', () => {
    expect(isTokenRefreshResponse({})).toBe(false)
  })

  test('false when access_token is not a string', () => {
    expect(isTokenRefreshResponse({ access_token: 12345 })).toBe(false)
  })

  test('false for non-object values', () => {
    expect(isTokenRefreshResponse(null)).toBe(false)
    expect(isTokenRefreshResponse(undefined)).toBe(false)
    expect(isTokenRefreshResponse('tok')).toBe(false)
  })
})
