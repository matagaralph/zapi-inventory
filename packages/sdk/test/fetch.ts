import type { FetchFunction, JSONValue } from '../src/http.ts'

export type FetchHandler = (
  request: Request,
  call: number,
  signal: AbortSignal
) => Response | Promise<Response>

export interface ControlledFetch {
  fetch: FetchFunction
  /** A readable copy of every request received, in order. */
  requests: Request[]
}

/** A `fetch` implementation that never touches the network and records every request. */
export function createFetch(handler: FetchHandler): ControlledFetch {
  const requests: Request[] = []

  const fetch: FetchFunction = async (input, init) => {
    const request = new Request(input, init)
    requests.push(request.clone())
    // Node links a copied Request's signal to the caller's only weakly, so after a garbage
    // collection an abort can miss it. Handlers get the caller's own signal instead.
    return handler(request, requests.length, init?.signal ?? request.signal)
  }

  return { fetch, requests }
}

export function json(body: JSONValue, status = 200): Response {
  return Response.json(body, { status })
}

/** Builds a fetch that answers OAuth token refreshes and delegates API calls to `api`. */
export function createZohoFetch(api: FetchHandler, accessToken = 'access-token'): ControlledFetch {
  let apiCalls = 0
  return createFetch((request, _call, signal) => {
    if (new URL(request.url).pathname === '/oauth/v2/token') {
      return json({ access_token: accessToken, expires_in: 3600 })
    }
    apiCalls += 1
    return api(request, apiCalls, signal)
  })
}

/** Settles only when `signal` aborts, rejecting with its reason like a real fetch would. */
export function waitForAbort(signal: AbortSignal): Promise<Response> {
  return new Promise((_resolve, reject) => {
    if (signal.aborted) reject(signal.reason)
    signal.addEventListener('abort', () => reject(signal.reason))
  })
}

/** A fetch that only settles when its request is aborted, for exercising timeouts. */
export function createHangingFetch(): ControlledFetch {
  return createFetch((_request, _call, signal) => waitForAbort(signal))
}

export function apiRequests(requests: Request[]): Request[] {
  return requests.filter((request) => new URL(request.url).pathname !== '/oauth/v2/token')
}

export function tokenRequests(requests: Request[]): Request[] {
  return requests.filter((request) => new URL(request.url).pathname === '/oauth/v2/token')
}
