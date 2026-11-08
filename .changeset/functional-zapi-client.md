---
'zapi-inventory': major
---

Replaced the class-based client with functions and native `fetch`. This is a breaking change. See "Migrating from 1.x" in the README.

- The entry point is now the named `zAPI(options)` function instead of the default-exported `ZohoInventory` class. The inferred client type is exported as `ZAPI`.
- Every resource property is now lowercase, for example `salesOrders` → `salesorders`, `shipmentOrders` → `shipmentorders`, `purchaseOrders` → `purchaseorders`, `contactPersons` → `contactpersons` and `compositeItems` → `compositeitems`. Operation names, arguments and response types are unchanged.
- Resource classes are replaced by `create*` factory functions, and their names remain exported as types.
- `APIError` is now a native `Error` with typed metadata instead of a class. Use `isAPIError` instead of `instanceof`, and `createAPIError` instead of `new APIError`. Network failures now reject with an `APIError` carrying the original `cause`.
- `xior` and its retry plugin were removed, so the SDK has no runtime dependencies. `HTTPClient` is now an interface created by `createHTTPClient`, and `authInterceptor` receives a `{ headers, params }` request config.
- Added an optional `fetch` option, used for both API and OAuth requests.
- Fixed the default 10 second timeout, which was never applied, and binary downloads, which now resolve to a `Blob` instead of a corrupted string.
