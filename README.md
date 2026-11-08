# zapi-inventory

[![npm version](https://img.shields.io/npm/v/zapi-inventory.svg)](https://www.npmjs.com/package/zapi-inventory)
[![CI](https://img.shields.io/github/actions/workflow/status/matagaralph/zapi-inventory/ci.yml?branch=main&label=CI)](https://github.com/matagaralph/zapi-inventory/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/zapi-inventory.svg)](LICENSE)

A community-maintained, type-safe TypeScript SDK for the [Zoho Inventory API](https://www.zoho.com/inventory/api/v1/introduction/#overview). Types are generated directly from Zoho's official OpenAPI specification, with one module per API domain and OAuth token handling built in.

The SDK has no runtime dependencies. It uses the web-standard `fetch`, so it runs on Node.js, Bun, Deno and Cloudflare Workers.

## Installation

```bash
pnpm add zapi-inventory
```

## Quick start

```ts
import { zAPI } from 'zapi-inventory'

const inventory = zAPI({
  client: { id: process.env.ZOHO_CLIENT_ID, secret: process.env.ZOHO_CLIENT_SECRET },
  orgId: process.env.ZOHO_ORGANIZATION_ID,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN,
  dc: 'eu',
})

const item = await inventory.items.create({
  name: 'Solar Panel',
  rate: 120,
  item_type: 'inventory',
})

const orders = await inventory.salesorders.list()
await inventory.salesorders.markAsConfirmed('salesorder-id')
```

## Configuration

`zAPI(options)` takes a single configuration object:

| Option          | Type             | Required | Description                                                                                                                                                                       |
| --------------- | ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `client.id`     | `string`         | Yes      | Client ID from the [Zoho Developer Console](https://api-console.zoho.com/).                                                                                                       |
| `client.secret` | `string`         | Yes      | Client secret from the Zoho Developer Console.                                                                                                                                    |
| `orgId`         | `string`         | Yes      | The Zoho Inventory organisation ID to operate against.                                                                                                                            |
| `refreshToken`  | `string`         | Yes      | A permanent OAuth 2.0 refresh token. The SDK uses it to mint and cache short-lived access tokens automatically.                                                                   |
| `dc`            | `ZohoDataCenter` | No       | Data centre for the API domain: `com`, `eu`, `in`, `com.au`, `jp`, `ca`, `com.cn` or `sa`. Defaults to `com`.                                                                     |
| `timeout`       | `number`         | No       | Milliseconds before an API request or OAuth token refresh is aborted. Defaults to `10000`, and `0` disables the timeout.                                                          |
| `retryTimes`    | `number`         | No       | How many times a failed API request is retried, one second apart. Defaults to `3`, and `0` disables retries. See [Error handling](#error-handling).                               |
| `store`         | `TokenStore`     | No       | A custom token store (file, database, Redis, etc.) to persist cached tokens across process restarts. Defaults to an in-memory store.                                              |
| `fetch`         | `FetchFunction`  | No       | The `fetch` implementation used for both API and OAuth requests: any `(input, init) => Promise<Response>` function, including the native `fetch`. Defaults to `globalThis.fetch`. |

Each `zAPI()` call creates an independent client with its own HTTP client, token cache and in-flight token refresh, so several organisations or credentials can be used side by side. The client type is exported as `ZAPI`:

```ts
import { zAPI, type ZAPI } from 'zapi-inventory'

function syncOrders(inventory: ZAPI) {
  return inventory.salesorders.list({ status: 'confirmed' })
}
```

### Custom fetch

Pass `fetch` to add logging, tracing, proxies or a test double. It receives every request the SDK makes, including OAuth token refreshes:

```ts
const inventory = zAPI({
  // ...credentials
  fetch: async (input, init) => {
    const started = Date.now()
    const response = await fetch(input, init)
    console.log(init?.method ?? 'GET', String(input), response.status, `${Date.now() - started}ms`)
    return response
  },
})
```

## Modules

Every Zoho Inventory API domain is exposed as a lowercase property on the client, for example `inventory.items.list()`, `inventory.salesorders.create(...)`, `inventory.shipmentorders.get(...)` or `inventory.purchaseorders.list()`.

Zoho nests most response bodies under a root key that matches the resource, for example `{ "item": { ... } }` for a single item or `{ "salesorders": [...] }` for a list. The SDK unwraps that root key for you, so a call resolves directly to the data you asked for:

```ts
const item = await inventory.items.create({
  name: 'Solar Panel',
  rate: 120,
  item_type: 'inventory',
})
// item is the item object itself, not { item: { ... } }

const salesOrders = await inventory.salesorders.list()
// salesOrders is an array, not { salesorders: [...] }
```

Response types describe what Zoho documents. They are not validated at runtime.

Binary downloads such as `items.getImage()` or attachment and document downloads resolve to a `Blob`.

### Dropshipping orders

`salesorders.create()` accepts an optional `custom_shipping_address` for orders that ship to an address not saved on the contact, such as the end customer of a dropshipping order:

```ts
await inventory.salesorders.create({
  customer_id: customerId,
  line_items: [{ item_id: itemId, quantity: 1 }],
  custom_shipping_address: {
    attention: 'Anna Schmidt',
    company_name: 'Schmidt GmbH',
    address: 'Leopoldstraße 12',
    street2: '3. OG',
    city: 'München',
    state: 'BY',
    zip: '80802',
    country: 'Germany',
    phone: '+49 89 1234567',
  },
})
```

| Field          | Required | Description                                                                       |
| -------------- | -------- | --------------------------------------------------------------------------------- |
| `attention`    | Yes      | Recipient name, or the company name when there is no recipient name.              |
| `company_name` | No       | Recipient's company. Send it only when both a recipient name and a company exist. |
| `address`      | Yes      | First line of the street address.                                                 |
| `street2`      | No       | Second line of the street address.                                                |
| `city`         | Yes      | City.                                                                             |
| `state`        | No       | State or province code, for example `BY`.                                         |
| `zip`          | Yes      | Postal code. Send an empty string when there is none.                             |
| `country`      | Yes      | Country name, for example `Germany`.                                              |
| `phone`        | No       | Phone number for the delivery.                                                    |

Zoho's published OpenAPI spec omits this field, so it is added to the spec this SDK generates its types from.

## Error handling

Every request that fails, whether Zoho returns a non-2xx status, the request times out, or it never completes, rejects with an `APIError`. Use `isAPIError` to narrow it:

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

An `APIError` is a native `Error` instance (with its usual `stack`) carrying extra metadata:

| Property     | Type         | Description                                                                     |
| ------------ | ------------ | ------------------------------------------------------------------------------- |
| `name`       | `'APIError'` | Always `APIError`.                                                              |
| `message`    | `string`     | Zoho's error message, or a description of the HTTP, timeout or network failure. |
| `statusCode` | `number?`    | The HTTP status code, when the request reached Zoho.                            |
| `url`        | `string?`    | The request URL, without the query string.                                      |
| `data`       | `unknown`    | The raw response body, if any: parsed JSON, or text when the body is not JSON.  |
| `cause`      | `unknown`    | The underlying error for timeouts and network failures.                         |

`isAPIError` recognises errors from any copy of the SDK (for example, when both the ESM and CommonJS builds are loaded), and never matches a plain `Error` that merely has `name === 'APIError'`. To create one yourself, for example in a custom token store or a test, use `createAPIError(message, { statusCode, url, data, cause })`.

Failed requests are retried automatically (three times by default, one second apart) before the SDK gives up and rejects with the last error:

- `429 Too Many Requests` is retried for every method, because Zoho rejected the request without processing it.
- `5xx` responses are retried only for `GET`, `PUT` and `DELETE`. A `POST` or `PATCH`, such as creating a record or sending an email, may already have been applied when Zoho returns a `5xx`, so retrying it could repeat the change. Check whether it took effect before trying again.
- Every other error, including timeouts and network failures, surfaces immediately.

Set `retryTimes` to change the number of retries, or `0` to disable them.

## HTTP client

The SDK exposes its HTTP client on `inventory.http` for making direct, authenticated requests to the Zoho Inventory API. This is useful for beta endpoints or sub-resources the SDK doesn't wrap yet:

```ts
await inventory.http.post<T>({
  path: ['items', itemId, 'image'], // path segments
  body: formData, // request payload
  query: { preview: true }, // query parameters
  headers: { 'X-Custom-Header': 'value' }, // custom headers
  timeout: 5000, // request-specific timeout
})
```

Each `path` segment is percent-encoded, so pass segments separately (`['items', itemId]`, not `['items/' + itemId]`). A resource ID can therefore never change the endpoint, add query parameters or override the organisation. Segments that are exactly `.` or `..` are rejected with an `APIError` before any request is sent.

`get`, `post`, `put`, `patch` and `delete` are available. Plain objects are sent as JSON, while `FormData`, `URLSearchParams`, `Blob`, binary data and streams are sent as they are.

## Token storage

By default, access tokens are cached in memory and re-fetched on every process restart. To persist them (across restarts, or across multiple processes), implement `TokenStore` and pass it as `store`:

```ts
import type { TokenStore } from 'zapi-inventory'

const redisTokenStore: TokenStore = {
  async findToken(clientId, orgId) {
    /* ... */
  },
  async saveToken(token) {
    /* ... */
  },
  async deleteToken(clientId, orgId) {
    /* ... */
  },
}

const inventory = zAPI({ /* ...credentials */ store: redisTokenStore })
```

Tokens are refreshed five minutes before they expire, and concurrent requests share a single refresh.

A stored token is reused only when its `refreshToken` matches the client's own, so a store shared by several users of the same OAuth app and organisation never hands one user another's access token (and permissions). Return the `refreshToken` you received in `saveToken` from `findToken`. A token without it is ignored and refreshed. Stores keep one token per `clientId` and `orgId`, so clients with different refresh tokens sharing a store replace each other's token and refresh more often. Give each grant its own store, or its own key prefix, to avoid that.

## Migrating from 1.x

Version 2 replaces the class-based client with functions. Every operation keeps its name, arguments and response type. Only the entry point, resource property names and a few exported helpers changed.

### Entry point

```ts
// Before
import ZohoInventory from 'zapi-inventory'
const inventory = new ZohoInventory({ client, orgId, refreshToken })

// After
import { zAPI } from 'zapi-inventory'
const inventory = zAPI({ client, orgId, refreshToken })
```

The default export is gone, so import the named `zAPI` function. The options are unchanged, plus the new optional `fetch`. `ZohoInventoryOptions` is still exported as a deprecated alias of `ZAPIOptions`.

### Resource properties

Every resource property is now lowercase:

| Before (1.x)                     | After (2.0)                      | Change    | Exported class → factory                              |
| -------------------------------- | -------------------------------- | --------- | ----------------------------------------------------- |
| `inventory.batches`              | `inventory.batches`              | Unchanged | `Batches` → `createBatches`                           |
| `inventory.bills`                | `inventory.bills`                | Unchanged | `Bills` → `createBills`                               |
| `inventory.compositeItems`       | `inventory.compositeitems`       | Renamed   | `CompositeItems` → `createCompositeItems`             |
| `inventory.contactPersons`       | `inventory.contactpersons`       | Renamed   | `ContactPersons` → `createContactPersons`             |
| `inventory.contacts`             | `inventory.contacts`             | Unchanged | `Contacts` → `createContacts`                         |
| `inventory.creditNotes`          | `inventory.creditnotes`          | Renamed   | `CreditNotes` → `createCreditNotes`                   |
| `inventory.currencies`           | `inventory.currencies`           | Unchanged | `Currencies` → `createCurrencies`                     |
| `inventory.customerPayments`     | `inventory.customerpayments`     | Renamed   | `CustomerPayments` → `createCustomerPayments`         |
| `inventory.deliveryChallans`     | `inventory.deliverychallans`     | Renamed   | `DeliveryChallans` → `createDeliveryChallans`         |
| `inventory.inventoryAdjustments` | `inventory.inventoryadjustments` | Renamed   | `InventoryAdjustments` → `createInventoryAdjustments` |
| `inventory.inventoryCounts`      | `inventory.inventorycounts`      | Renamed   | `InventoryCounts` → `createInventoryCounts`           |
| `inventory.internal`             | `inventory.internal`             | Unchanged | `Internal` → `createInternal`                         |
| `inventory.invoices`             | `inventory.invoices`             | Unchanged | `Invoices` → `createInvoices`                         |
| `inventory.itemGroups`           | `inventory.itemgroups`           | Renamed   | `ItemGroups` → `createItemGroups`                     |
| `inventory.items`                | `inventory.items`                | Unchanged | `Items` → `createItems`                               |
| `inventory.landedCosts`          | `inventory.landedcosts`          | Renamed   | `LandedCosts` → `createLandedCosts`                   |
| `inventory.locations`            | `inventory.locations`            | Unchanged | `Locations` → `createLocations`                       |
| `inventory.moveOrders`           | `inventory.moveorders`           | Renamed   | `MoveOrders` → `createMoveOrders`                     |
| `inventory.organizations`        | `inventory.organizations`        | Unchanged | `Organizations` → `createOrganizations`               |
| `inventory.packages`             | `inventory.packages`             | Unchanged | `Packages` → `createPackages`                         |
| `inventory.picklists`            | `inventory.picklists`            | Unchanged | `Picklists` → `createPicklists`                       |
| `inventory.priceLists`           | `inventory.pricelists`           | Renamed   | `PriceLists` → `createPriceLists`                     |
| `inventory.purchaseOrders`       | `inventory.purchaseorders`       | Renamed   | `PurchaseOrders` → `createPurchaseOrders`             |
| `inventory.purchaseReceives`     | `inventory.purchasereceives`     | Renamed   | `PurchaseReceives` → `createPurchaseReceives`         |
| `inventory.putaways`             | `inventory.putaways`             | Unchanged | `Putaways` → `createPutaways`                         |
| `inventory.replenishment`        | `inventory.replenishment`        | Unchanged | `Replenishment` → `createReplenishment`               |
| `inventory.reportingTags`        | `inventory.reportingtags`        | Renamed   | `ReportingTags` → `createReportingTags`               |
| `inventory.retainerInvoices`     | `inventory.retainerinvoices`     | Renamed   | `RetainerInvoices` → `createRetainerInvoices`         |
| `inventory.salesOrders`          | `inventory.salesorders`          | Renamed   | `SalesOrders` → `createSalesOrders`                   |
| `inventory.salesReturns`         | `inventory.salesreturns`         | Renamed   | `SalesReturns` → `createSalesReturns`                 |
| `inventory.serialNumbers`        | `inventory.serialnumbers`        | Renamed   | `SerialNumbers` → `createSerialNumbers`               |
| `inventory.shipmentOrders`       | `inventory.shipmentorders`       | Renamed   | `ShipmentOrders` → `createShipmentOrders`             |
| `inventory.storageLocations`     | `inventory.storagelocations`     | Renamed   | `StorageLocations` → `createStorageLocations`         |
| `inventory.tasks`                | `inventory.tasks`                | Unchanged | `Tasks` → `createTasks`                               |
| `inventory.taxes`                | `inventory.taxes`                | Unchanged | `Taxes` → `createTaxes`                               |
| `inventory.transferOrders`       | `inventory.transferorders`       | Renamed   | `TransferOrders` → `createTransferOrders`             |
| `inventory.unitsOfMeasurement`   | `inventory.unitsofmeasurement`   | Renamed   | `UnitsOfMeasurement` → `createUnitsOfMeasurement`     |
| `inventory.users`                | `inventory.users`                | Unchanged | `Users` → `createUsers`                               |
| `inventory.vendorCredits`        | `inventory.vendorcredits`        | Renamed   | `VendorCredits` → `createVendorCredits`               |

The exported resource class names (`SalesOrders`, `Items`, and so on) are now types (`ReturnType` of the matching `create*` factory), so `import type { SalesOrders } from 'zapi-inventory'` keeps working, but `new SalesOrders(http)` becomes `createSalesOrders(http)`.

### Errors

`APIError` is no longer a class. Replace `instanceof APIError` with `isAPIError(err)`, and `new APIError(message, statusCode, url, data)` with `createAPIError(message, { statusCode, url, data })`. `APIError.fromXiorError` has been removed. `import type { APIError }` still gives you the error type.

Network failures (DNS, connection refused, aborted connections) now reject with an `APIError` whose `cause` is the original error, as the error handling docs always described. Previously they surfaced as the raw transport error.

### HTTP transport

The SDK now uses the platform's `fetch` instead of `xior`, so it ships with no runtime dependencies.

- `HTTPClient` is now an interface. Create one with `createHTTPClient(baseURL, options)` instead of `new HTTPClient(baseURL, options)`.
- The `authInterceptor` option receives a `RequestConfig` (`{ headers, params }`) instead of xior's `XiorInterceptorRequestConfig`, and returns it (or a promise of it). `AuthInterceptor`, `RequestConfig`, `HTTPClientOptions`, `QueryParams`, `JSONValue` and `ResponseBody` are exported types.
- `HTTPClientOptions` gains an optional `fetch`, typed as the exported `FetchFunction`: `(input: string | URL | Request, init?: RequestInit) => Promise<Response>`. It is a plain function type rather than `typeof fetch`, because Bun's `fetch` type has extra members that a wrapper function would otherwise have to implement.
- The default timeout of 10 seconds is now actually applied. Under xior, a per-request `timeout: undefined` overrode the client default, so requests could hang indefinitely.
- Successful binary responses resolve to a `Blob`. Under xior, every body was read as text, so `Blob`-typed downloads (item images, attachments, documents) resolved to a corrupted string.
- Empty responses (such as `204 No Content`) resolve to `undefined` instead of an empty string.
- `POST` and `PATCH` requests are no longer retried on `5xx` responses, so a create or email that Zoho applied before failing is not repeated. `429` responses are still retried for every method. The new `retryTimes` option controls the number of retries.
- Path segments are percent-encoded, and `.` or `..` segments are rejected. Previously an ID containing `?`, `#`, `/` or `..` could change the endpoint or override `organization_id`. If you passed a pre-joined path such as `['items/123']` to `inventory.http`, split it into segments.

### Response root key fixes

Zoho's published OpenAPI specs, which this SDK generates its types from, name some response root keys differently from what the API actually returns. The specs are corrected in this repository, so these operations now resolve to the record instead of `undefined`:

| Operation                                        | Spec said          | Zoho returns      |
| ------------------------------------------------ | ------------------ | ----------------- |
| `salesorders.create()`, `update()`               | `sales_order`      | `salesorder`      |
| `shipmentorders.create()`, `get()`               | `shipment_order`   | `shipmentorder`   |
| `packages.list()`                                | `packagea` (typo)  | `packages`        |
| `purchaseorders.create()`, `get()`, `update()`   | `purchase_order`   | `purchaseorder`   |
| `purchasereceives.create()`, `get()`, `update()` | `purchase_receive` | `purchasereceive` |

If you index the generated response types directly, for example `CreateSalesOrderResponse['sales_order']`, switch to the new key.

## Version history

Early versions (`1.0.0-dev`, `1.1.0`, `2.0.0`–`3.0.0`) were experimentation from when this started as a toy SDK and were mistakes in versioning, and they have since been unpublished. The `0.8.5`–`0.12.2` line is the stable pre-rewrite history. `1.0.0-rc.x` and onward is the current, actively maintained architecture: types generated from Zoho's official OpenAPI specs, one module per API domain, and OAuth token handling with a pluggable token store. The next major release replaces the class-based client with the function-based `zAPI()` client described above.

## Contributing

This repository uses pnpm workspaces. Install dependencies with `pnpm install`, then use `pnpm generate`, `pnpm build`, `pnpm typecheck`, `pnpm lint` and `pnpm format:check`. Run focused tests from `packages/sdk` with `pnpm exec vitest run path/to/test -t "<pattern>"`.

See [the contributing documentation](./.github/CONTRIBUTING.md).

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
