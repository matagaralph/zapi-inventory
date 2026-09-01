# zapi-inventory

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

  Fixed several endpoints (item images, delivery challan and purchase receive attachments, putaway documents) that were typed as returning `unknown`; they now return `Blob` as they should. Item image uploads now build their own multipart body from a `Blob` argument instead of asking the caller to hand over an already-built body.

  Tightened internal type safety in `APIError.fromXiorError` and the OAuth token refresh path, replacing unchecked casts with proper type guards, and added test coverage for the SDK's own logic (HTTP client, error mapping, OAuth token caching and refresh, in-memory token store).

## 1.0.0-rc.0

### Major Changes

- Full rewrite of the SDK: types generated from Zoho's official OpenAPI specs, a resource module per Zoho Inventory API domain, OAuth token handling with a pluggable token store, and a typed HTTP client. This is the first 1.0.0 release candidate.
