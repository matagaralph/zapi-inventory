# zapi-inventory

A community-maintained, robust, and type-safe Typescript SDK that allows you to interact with the [Zoho Inventory API](https://www.zoho.com/inventory/api/v1/introduction/#overview).

Built on top of [xior](https://github.com/suhaotian/xior), this SDK handles the complexities of Zoho's OAuth2 authentication, rate limiting, and pagination, allowing you to focus on building your business logic.

## Installation

```sh
bun add zapi-inventory
```

## API

This module exports a class constructor which takes a configuration object.

### `ZohoInventory(config)`

Creates a new `ZohoInventory` instance.

#### Arguments

- `config` - Required - A plain JavaScript object that contains the configuration options.

  #### Options
  - `client` - Required - An object containing the Client ID and Client Secret obtained from the [Zoho Developer Console](https://api-console.zoho.com/).
    - `id` - A string specifying the Client ID.
    - `secret` - A string specifying the Client Secret.
  - `orgId` - Required - A string that specifies the Zoho Inventory Organization ID. This determines which organization's data the SDK will access.
  - `refreshToken` - Required - A string representing the permanent OAuth 2.0 refresh token. The SDK uses this to automatically generate and manage short-lived access tokens.
  - `dc` - Required - A string specifying the data centre suffix for the API domain. Common values include `.com`, `.eu`, `.in`, `.com.au`, or `.jp`.
  - `timeout` - Optional - The number of milliseconds before a request times out. If the request takes longer than `timeout`, it will be aborted. Defaults to `30000` (30 seconds).

#### Return value

A `ZohoInventory` instance.

#### Exceptions

Throws an `Error or ZohoApiError` exception if the required options are missing or an http error occurs.

## Resources

Every resource or zoho inventory module is accessed via your `inventory` instance:

```js
const inventory = new ZohoInventory({
  client: { id: Bun.env.ZOHO_CLIENT_ID, secret: Bun.env.ZOHO_SECRET_ID },
  orgId: Bun.env.ZOHO_ORGANIZATION_ID,
  refreshToken: ZOHO_REFREH_TOKEN,
  dc: '.eu',
});

// inventory.<module>.<method_name>
```

Each method returns a `Promise` that resolves with the result:

```js
inventory.salesorders
  .list({ limit: 5 })
  .then((orders) => console.log(orders))
  .catch((err) => console.error(err));
```

When using `zapi-inventory`, you do not have to specify the root key (e.g., `item`, `salesorder`, or `contact`) as the module automatically wraps the provided data. Using the item creation example, this translates to:

```javascript
inventory.items
  .create({ name: 'Solar Panel', rate: 120, item_type: 'inventory' })
  .then((item) => console.log(item))
  .catch((err) => console.error(err));
```

## Api Client

The SDK exposes an API client on the `inventory` instance for making raw HTTP requests (GET, POST, PUT, DELETE) directly to the Zoho Inventory API. This is useful for accessing beta endpoints or retrieving specific sub-resources by crafting custom requests when the SDK does not yet provide a wrapper.

```typescript
inventory.apiClient.get(options: {
  path: string['settings', 'currencies', currencyId];    // Array of path segments this means /settings/currencies/currencyId
  params?: Record<string, any>; // Query parameters
  body: data
}): Promise<any>
```

### Pagination

The SDK’s `list` method supports a `limit` option. If provided, it restricts how many records are fetched in total.  
If omitted, the method retrieves **all** available records by automatically iterating through every page, bypassing Zoho’s native pagination. This can result in large payloads and slow responses.

Use the unbounded `list` call with caution. When possible, combine `limit` with filters such as `created_date_start`, `created_date_end`, or other query parameters to narrow the result set and avoid unnecessary data retrieval.

Follow the developer on X (formerly Twitter): [@matagaralph](https://x.com/matagaralph).
