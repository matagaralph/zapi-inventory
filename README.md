# zapi-inventory

[![npm version](https://img.shields.io/npm/v/zapi-inventory.svg)](https://www.npmjs.com/package/zapi-inventory)
[![CI](https://img.shields.io/github/actions/workflow/status/matagaralph/zapi-inventory/ci.yml?branch=main&label=CI)](https://github.com/matagaralph/zapi-inventory/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/zapi-inventory.svg)](LICENSE)

A community-maintained, type-safe TypeScript SDK for the [Zoho Inventory API](https://www.zoho.com/inventory/api/v1/introduction/#overview). Types are generated directly from Zoho's official OpenAPI specification, with one module per API domain and OAuth token handling built in.

## Installation

```bash
bun add zapi-inventory
```

## Quick start

```ts
import ZohoInventory from 'zapi-inventory'

const inventory = new ZohoInventory({
  client: { id: Bun.env.ZOHO_CLIENT_ID, secret: Bun.env.ZOHO_CLIENT_SECRET },
  orgId: Bun.env.ZOHO_ORGANIZATION_ID,
  refreshToken: Bun.env.ZOHO_REFRESH_TOKEN,
  dc: 'eu',
})

const item = await inventory.items.create({
  name: 'Solar Panel',
  rate: 120,
  item_type: 'inventory',
})
```

## Configuration

`new ZohoInventory(options)` takes a single configuration object:

| Option          | Type             | Required | Description                                                                                                                          |
| --------------- | ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `client.id`     | `string`         | Yes      | Client ID from the [Zoho Developer Console](https://api-console.zoho.com/).                                                          |
| `client.secret` | `string`         | Yes      | Client secret from the Zoho Developer Console.                                                                                       |
| `orgId`         | `string`         | Yes      | The Zoho Inventory organization ID to operate against.                                                                               |
| `refreshToken`  | `string`         | Yes      | A permanent OAuth 2.0 refresh token. The SDK uses it to mint and cache short-lived access tokens automatically.                      |
| `dc`            | `ZohoDataCenter` | No       | Data centre for the API domain: `com`, `eu`, `in`, `com.au`, `jp`, `ca`, `com.cn` or `sa`. Defaults to `com`.                        |
| `timeout`       | `number`         | No       | Milliseconds before a request is aborted. Defaults to `10000`.                                                                       |
| `store`         | `TokenStore`     | No       | A custom token store (file, database, Redis, etc.) to persist cached tokens across process restarts. Defaults to an in-memory store. |

## Modules

Every Zoho Inventory API domain is exposed as a module on the `ZohoInventory` instance, e.g. `inventory.items.list()` or `inventory.salesOrders.create(...)`.

Zoho nests most response bodies under a root key that matches the resource, for example `{ "item": { ... } }` for a single item or `{ "salesorders": [...] }` for a list. The SDK unwraps that root key for you, so a call resolves directly to the data you asked for:

```ts
const item = await inventory.items.create({
  name: 'Solar Panel',
  rate: 120,
  item_type: 'inventory',
})
// item is the item object itself, not { item: { ... } }

const salesOrders = await inventory.salesOrders.list()
// salesOrders is an array, not { salesorders: [...] }
```

## Error handling

Every request that fails, whether Zoho returns a non-2xx status or the request never completes, rejects with an `APIError`:

```ts
import { isAPIError } from 'zapi-inventory'

try {
  await inventory.items.get(itemId)
} catch (err) {
  if (isAPIError(err)) {
    console.error(err.statusCode, err.message, err.url, err.data)
  } else {
    throw err
  }
}
```

`APIError` extends the built-in `Error` and adds:

| Property     | Type      | Description                                                           |
| ------------ | --------- | --------------------------------------------------------------------- |
| `message`    | `string`  | Zoho's error message, or the underlying HTTP error if none was given. |
| `statusCode` | `number?` | The HTTP status code, when the request reached Zoho.                  |
| `url`        | `string?` | The full request URL.                                                 |
| `data`       | `unknown` | The raw response body, if any.                                        |

`429` and `5xx` responses are retried automatically (three times, by default) before the SDK gives up and rejects; every other error surfaces immediately.

## HTTP Client

The SDK exposes its HTTP client on `inventory.http` for making direct requests to the Zoho Inventory API. This is useful for beta endpoints or sub-resources the SDK doesn't wrap yet:

```ts
await inventory.http.post<T>({
  path: ['items', itemId, 'image'], // path segments
  body: formData, // request payload
  query: { preview: true }, // query parameters
  headers: { 'X-Custom-Header': 'value' }, // custom headers
  timeout: 5000, // request-specific timeout
})
```

## Token storage

By default, access tokens are cached in memory and re-fetched on every process restart. To persist them (across restarts, or across multiple processes), implement `TokenStore` and pass it as `store`:

```ts
import type { StoredToken, TokenStore } from 'zapi-inventory'

class RedisTokenStore implements TokenStore {
  async findToken(clientId: string, orgId: string) {
    /* ... */
  }
  async saveToken(token: StoredToken) {
    /* ... */
  }
  async deleteToken(clientId: string, orgId: string) {
    /* ... */
  }
}
```

## Version history

Early versions (`1.0.0-dev`, `1.1.0`, `2.0.0`–`3.0.0`) were experimentation from when this started as a toy SDK and were mistakes in versioning; they have since been unpublished. The `0.8.5`–`0.12.2` line is the stable pre-rewrite history. `1.0.0-rc.x` and onward is the current, actively maintained architecture: types generated from Zoho's official OpenAPI specs, one module per API domain, and OAuth token handling with a pluggable token store.

## Contributing

See [the contributing documentation](./.github/CONTRIBUTING.md).

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
