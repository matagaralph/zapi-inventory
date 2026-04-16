# zapi-inventory

A community-maintained, robust, and type-safe Typescript SDK that allows you to interact with the [Zoho Inventory API](https://www.zoho.com/inventory/api/v1/introduction/#overview).

## Installation

```bash
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
  - `dc` - Optional - A string specifying the data centre for the API domain. Supported values: `com`, `eu`, `in`, `com.au`, `jp`, `ca`, `com.cn`, `sa`. Defaults to `com`.
  - `timeout` - Optional - The number of milliseconds before a request times out. If the request takes longer than `timeout`, it will be aborted. Defaults to `10000` (10 seconds).
  - `store` - Optional - A custom token store implementation. The SDK uses `FileTokenStore` by default, which persists tokens to the file system. You can provide your own `TokenStore` implementation for alternative storage strategies.

## Exceptions

Throws an `Error or SDKExecepion` exception if the required options are missing or an http error occurs.

## Resources

Every resource or zoho inventory module is accessed via your `inventory` instance:

```ts
const inventory = new ZohoInventory({
  client: { id: Bun.env.ZOHO_CLIENT_ID, secret: Bun.env.ZOHO_CLIENT_SECRET },
  orgId: Bun.env.ZOHO_ORGANIZATION_ID,
  refreshToken: Bun.env.ZOHO_REFRESH_TOKEN,
  dc: 'eu',
});

// inventory.<module>.<method_name>
```

When using `zapi-inventory`, you do not have to specify the root key (e.g., `item`, `salesorder`, or `contact`) as the module automatically wraps the provided data. Using the item creation example, this translates to:

```ts
inventory.items
  .create({ name: 'Solar Panel', rate: 120, item_type: 'inventory' })
  .then((item) => console.log(item))
  .catch((err) => console.error(err));
```

The SDK exposes an http client on the `SDK` instance for making raw HTTP requests (GET, POST, PUT, DELETE) directly to the Zoho Inventory API. This is useful for accessing beta endpoints or retrieving specific sub-resources by crafting custom requests when the SDK does not yet provide a wrapper.

```ts
inventory.http.post<T>(options: {
  path: string[];    // Array of path segments
  body?: unknown; // Request payload
  query?: Record<string, string | number | boolean>; // Query parameters
  headers?: Record<string, string>; // Custom headers
  timeout?: number; // Request-specific timeout
})
```

## Contributing

Contributions Welcome! You can contribute in the following ways.

- Create an Issue - Propose a new feature. Report a bug.
- Pull Request - Fix a bug or typo. Refactor the code.
- Share - Share your thoughts on the Blog, X, and others.
- Make your application - Please try to use the sdk.

For more details, see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

## Contributors

Thanks to [all contributors](https://github.com/matagaralph/graphs/contributors)!

## Authors

Ralph Mataga <https://github.com/matagaralph>

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
