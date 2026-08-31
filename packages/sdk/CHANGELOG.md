# zapi-inventory

## 1.0.0-rc.1

### Minor Changes

- 88c91bf: Added sales order list filters that Zoho's spec omits (`sort_column`, `sort_order`, `salesorder_number_contains`, `reference_number_contains`, `customer_id`, `created_date_start`/`end`, `shipment_date_start`/`end`, `status`, `location_ids`, `shipping_attention_contains`, `line_item_location_id`, `item_id`).

  Fixed a bug where the HTTP client retried every failed request, including non-retryable 4xx errors, because the retry plugin was wired up with the wrong option name. Only 429s and 5xxs are retried now.

  Fixed several endpoints (item images, delivery challan and purchase receive attachments, putaway documents) that were typed as returning `unknown`; they now return `Blob` as they should. Item image uploads now build their own multipart body from a `Blob` argument instead of asking the caller to hand over an already-built body.

  Tightened internal type safety in `APIError.fromXiorError` and the OAuth token refresh path, replacing unchecked casts with proper type guards, and added test coverage for the SDK's own logic (HTTP client, error mapping, OAuth token caching and refresh, in-memory token store).

## 1.0.0-rc.0

### Major Changes

- Full rewrite of the SDK: types generated from Zoho's official OpenAPI specs, a resource module per Zoho Inventory API domain, OAuth token handling with a pluggable token store, and a typed HTTP client. This is the first 1.0.0 release candidate.
