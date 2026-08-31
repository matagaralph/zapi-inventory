# zapi-inventory

[![npm version](https://img.shields.io/npm/v/zapi-inventory.svg)](https://www.npmjs.com/package/zapi-inventory)
[![CI](https://img.shields.io/github/actions/workflow/status/matagaralph/zapi-inventory/ci.yml?branch=main&label=CI)](https://github.com/matagaralph/zapi-inventory/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/zapi-inventory.svg)](LICENSE)

A community-maintained, type-safe TypeScript SDK for the [Zoho Inventory API](https://www.zoho.com/inventory/api/v1/introduction/#overview). Types are generated directly from Zoho's official OpenAPI specification, with one module per API domain and OAuth token handling built in.

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Modules](#modules)
- [Response shapes](#response-shapes)
- [Methods that return `void`](#methods-that-return-void)
- [Error handling](#error-handling)
- [Raw HTTP requests](#raw-http-requests)
- [Token storage](#token-storage)
- [Version history](#version-history)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
bun add zapi-inventory
```

`npm install`, `yarn add` and `pnpm add` work the same way.

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

| Property               | Domain                |
| ---------------------- | --------------------- |
| `batches`              | Batches               |
| `bills`                | Bills                 |
| `compositeItems`       | Composite items       |
| `contactPersons`       | Contact persons       |
| `contacts`             | Contacts              |
| `creditNotes`          | Credit notes          |
| `currencies`           | Currencies            |
| `customerPayments`     | Customer payments     |
| `deliveryChallans`     | Delivery challans     |
| `inventoryAdjustments` | Inventory adjustments |
| `inventoryCounts`      | Inventory counting    |
| `invoices`             | Invoices              |
| `itemGroups`           | Item groups           |
| `items`                | Items                 |
| `landedCosts`          | Landed costs          |
| `locations`            | Locations             |
| `moveOrders`           | Move orders           |
| `organizations`        | Organizations         |
| `packages`             | Packages              |
| `picklists`            | Picklists             |
| `priceLists`           | Price lists           |
| `purchaseOrders`       | Purchase orders       |
| `purchaseReceives`     | Purchase receives     |
| `putaways`             | Putaways              |
| `replenishment`        | Replenishment         |
| `reportingTags`        | Reporting tags        |
| `retainerInvoices`     | Retainer invoices     |
| `salesOrders`          | Sales orders          |
| `salesReturns`         | Sales returns         |
| `serialNumbers`        | Serial numbers        |
| `shipmentOrders`       | Shipment orders       |
| `storageLocations`     | Storage locations     |
| `tasks`                | Tasks                 |
| `taxes`                | Taxes                 |
| `transferOrders`       | Transfer orders       |
| `unitsOfMeasurement`   | Units of measurement  |
| `users`                | Users                 |
| `vendorCredits`        | Vendor credits        |

## Response shapes

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

## Methods that return `void`

Many Zoho endpoints (`delete`, `submit`, `approve`, `reject`, `markAsVoid`, `markAsActive`/`markAsInactive` and similar) respond with nothing but a fixed acknowledgement (`{ code, message }`) that carries no data a caller could act on. Those methods resolve to `Promise<void>` rather than that acknowledgement object:

```ts
await inventory.salesOrders.markAsConfirmed(salesOrderId)
// resolves with undefined; throws an APIError if the request failed
```

If a Zoho response genuinely carries data beyond an acknowledgement, that method keeps its real return type. `inventory.salesOrders.bulkConfirm(...)`, for instance, still resolves to the response body because it includes per-order success and error details.

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

## Raw HTTP requests

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

`get`, `post`, `put`, `patch` and `delete` are all available and handle authentication and the `organization_id` query parameter for you.

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

Contributions are welcome:

- Open an issue to propose a feature or report a bug.
- Open a pull request to fix a bug, fix a typo, or refactor existing code.
- Share the project or write about your experience using it.

## Contributors

Thanks to [all contributors](https://github.com/matagaralph/zapi-inventory/graphs/contributors)!

## Author

Ralph Mataga (<https://github.com/matagaralph>)

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
