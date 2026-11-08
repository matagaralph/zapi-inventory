# zapi-inventory

## 2.0.0-rc.0

### Major Changes

- 965c4fe: Replaced the class-based client with functions and native `fetch`. This is a breaking change. See "Migrating from 1.x" in the README.

  - The entry point is now the named `zAPI(options)` function instead of the default-exported `ZohoInventory` class. The inferred client type is exported as `ZAPI`.
  - Every resource property is now lowercase, for example `salesOrders` → `salesorders`, `shipmentOrders` → `shipmentorders`, `purchaseOrders` → `purchaseorders`, `contactPersons` → `contactpersons` and `compositeItems` → `compositeitems`. Operation names, arguments and response types are unchanged.
  - Resource classes are replaced by `create*` factory functions, and their names remain exported as types.
  - `APIError` is now a native `Error` with typed metadata instead of a class. Use `isAPIError` instead of `instanceof`, and `createAPIError` instead of `new APIError`. Network failures now reject with an `APIError` carrying the original `cause`.
  - `xior` and its retry plugin were removed, so the SDK has no runtime dependencies. `HTTPClient` is now an interface created by `createHTTPClient`, and `authInterceptor` receives a `{ headers, params }` request config.
  - Added an optional `fetch` option, used for both API and OAuth requests.
  - Fixed the default 10 second timeout, which was never applied, and binary downloads, which now resolve to a `Blob` instead of a corrupted string.

### Minor Changes

- 965c4fe: `POST` and `PATCH` requests are no longer retried on `5xx` responses. Zoho may apply a create or email before returning a server error, so retrying could repeat the change up to three times. `GET`, `PUT` and `DELETE` are still retried on `5xx`, and every method is still retried on `429`, which Zoho returns without processing the request. Added a `retryTimes` option to `zAPI()` to change the number of retries, or disable them with `0`.
- 965c4fe: `salesorders.create()` now accepts an optional `custom_shipping_address` for dropshipping orders that ship to an address not saved on the contact. It requires `attention`, `address`, `city`, `zip` and `country`, and optionally takes `company_name`, `street2`, `state` (a province code such as `BY`) and `phone`. Zoho's published spec omits this field, so it is added to the vendored spec.

### Patch Changes

- 965c4fe: Fixed resource IDs being able to rewrite request URLs. Path segments were joined into the URL unencoded, so an ID such as `order-1?organization_id=other#` moved the SDK's `organization_id` into an unsent fragment and let the ID choose the organisation, and IDs containing `/` or `..` could reach other endpoints. Every path segment is now percent-encoded, and `.` or `..` segments reject with an `APIError` before any request is sent. Callers of `inventory.http` must pass each path segment separately (`['items', itemId]`, not `['items/' + itemId]`).
- 965c4fe: Fixed 11 operations that always resolved to `undefined`. The vendored Zoho OpenAPI specs named their response root keys wrongly, so the SDK unwrapped a key Zoho never sends. The specs, generated types and modules now use the keys Zoho returns:

  | Operation                                        | Previously read    | Now reads         |
  | ------------------------------------------------ | ------------------ | ----------------- |
  | `salesorders.create()`, `update()`               | `sales_order`      | `salesorder`      |
  | `shipmentorders.create()`, `get()`               | `shipment_order`   | `shipmentorder`   |
  | `packages.list()`                                | `packagea` (typo)  | `packages`        |
  | `purchaseorders.create()`, `get()`, `update()`   | `purchase_order`   | `purchaseorder`   |
  | `purchasereceives.create()`, `get()`, `update()` | `purchase_receive` | `purchasereceive` |

  The response types follow the same rename, so code indexing the generated types directly (for example `CreateSalesOrderResponse['sales_order']`) must use the new key.

- 965c4fe: Token refreshes now time out. The OAuth request had no timeout and runs before an API request's own timer starts, so a stalled accounts server left every request waiting on that client's refresh hanging indefinitely. Refreshes now use the `timeout` option (10 seconds by default, and `0` disables it) and reject with an `APIError` such as `timeout of 10000ms exceeded`. The next request starts a new refresh.
- 965c4fe: The `fetch` option is typed as the exported `FetchFunction` (`(input, init) => Promise<Response>`) instead of `typeof globalThis.fetch`. Under Bun's types, `typeof fetch` requires extra members such as `preconnect`, so a plain wrapper function failed to type-check. The native `fetch` is still accepted in every runtime.
- 965c4fe: Fixed `ReadableStream` request bodies failing on Node.js with `RequestInit: duplex option is required when sending a body`. Stream bodies are now sent with `duplex: 'half'`, which Node's `fetch` requires and other runtimes accept.
- 965c4fe: Fixed shared token stores handing one user's access token to another. Stored tokens were looked up by `clientId` and `orgId` only, so two clients using the same OAuth app and organisation with different refresh tokens could use each other's access token and permissions. A stored token is now reused only when its `refreshToken` matches the client's own. Otherwise the client refreshes with its own grant. Custom `TokenStore` implementations must return the `refreshToken` they were given in `saveToken`.

## 1.1.1

### Patch Changes

- 02f7e1d: Republished as 1.1.1. The 1.1.0 publish to npm hit the same registry conflict 1.0.0 did and never went green in CI, so this version carries the same changes 1.1.0 was meant to ship.

## 1.1.0

### Minor Changes

- 8175d16: Added an internal module for undocumented Zoho endpoints, exposed as client.internal. getReportMetadata moved here from the SDK root, and getCountries was added alongside it. Everything on this module is experimental and can change or break without notice.

## 1.0.1

### Patch Changes

- 611ebfa: Republished as 1.0.1. The 1.0.0 publish to npm hit a registry conflict and never became installable, so this version carries the same changes v1.0.0 was meant to ship.

## 1.0.0

### Patch Changes

- 43f831f: Fixed addAttachment and getAttachment/getDocument on invoices, credit notes, retainer invoices, tasks and move orders. They now send files as multipart form data and return the downloaded file as a Blob, matching items, delivery challans, purchase receives and putaways. Before this fix no file bytes were ever sent or returned on these five modules.

## 1.0.0-rc.4

### Patch Changes

- bd40d1f: Added a TSDoc description to every SDK resource class, pulled from its OpenAPI spec, so hovering a module in an editor explains what it is for.

  Shrank the published package by stripping `@example` JSDoc lines and the unused `webhooks` type from generated declarations, and by minifying the built JS bundles. No `@description` comment was touched.

## 1.0.0-rc.3

### Minor Changes

- 69d677c: Added an experimental `getReportMetadata(path, params?)` method to the root SDK client. It fetches the `page_context` block Zoho returns for report style endpoints (pagination, applied filter, sort column and order, report name) for any resource path. The shape is marked `@experimental` and may still change.

## 1.0.0-rc.2

### Major Changes

- 13412b0: **Breaking:** SDK methods whose Zoho response is only an acknowledgement (`{code, message}`, nothing else) now return `void` instead of that object. This covers most delete, submit, approve, void and mark-as-active/inactive operations across `batches`, `bills`, `compositeitems`, `contact-persons`, `contacts`, `credit-notes`, `currency`, `customer-payments`, `delivery-challans`, `inventoryadjustments`, `invoices`, `itemgroups`, `items`, `landedcosts`, `locations`, `moveorders`, `packages`, `picklists`, `pricelists`, `purchaseorders`, `purchasereceives`, `putaways`, `replenishment`, `reporting-tags`, `retainer-invoices`, `salesorders`, `shipmentorders`, `storagelocations`, `transferorders`, `users` and `vendor-credits`. Methods whose response carries real data beyond the ack (such as `salesorders.bulkConfirm`, which returns per-item email success/error info) are unaffected.

  Also shrank the published package: the generated type declarations no longer carry unused `operations` fields (path/header params, request bodies, responses) for endpoints the SDK never reads that way, and test files no longer get their own `.d.ts` shipped. No exported type changed as a result.

## 1.0.0-rc.1

### Minor Changes

- 88c91bf: Added sales order list filters that Zoho's spec omits (`sort_column`, `sort_order`, `salesorder_number_contains`, `reference_number_contains`, `customer_id`, `created_date_start`/`end`, `shipment_date_start`/`end`, `status`, `location_ids`, `shipping_attention_contains`, `line_item_location_id`, `item_id`).

  Fixed a bug where the HTTP client retried every failed request, including non-retryable 4xx errors, because the retry plugin was wired up with the wrong option name. Only 429s and 5xxs are retried now.

  Fixed several endpoints (item images, delivery challan and purchase receive attachments, putaway documents) that were typed as returning `unknown`. They now return `Blob` as they should. Item image uploads now build their own multipart body from a `Blob` argument instead of asking the caller to hand over an already-built body.

  Tightened internal type safety in `APIError.fromXiorError` and the OAuth token refresh path, replacing unchecked casts with proper type guards, and added test coverage for the SDK's own logic (HTTP client, error mapping, OAuth token caching and refresh, in-memory token store).

## 1.0.0-rc.0

### Major Changes

- Full rewrite of the SDK: types generated from Zoho's official OpenAPI specs, a resource module per Zoho Inventory API domain, OAuth token handling with a pluggable token store, and a typed HTTP client. This is the first 1.0.0 release candidate.
