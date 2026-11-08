---
'zapi-inventory': patch
---

Fixed 11 operations that always resolved to `undefined`. The vendored Zoho OpenAPI specs named their response root keys wrongly, so the SDK unwrapped a key Zoho never sends. The specs, generated types and modules now use the keys Zoho returns:

| Operation                                        | Previously read    | Now reads         |
| ------------------------------------------------ | ------------------ | ----------------- |
| `salesorders.create()`, `update()`               | `sales_order`      | `salesorder`      |
| `shipmentorders.create()`, `get()`               | `shipment_order`   | `shipmentorder`   |
| `packages.list()`                                | `packagea` (typo)  | `packages`        |
| `purchaseorders.create()`, `get()`, `update()`   | `purchase_order`   | `purchaseorder`   |
| `purchasereceives.create()`, `get()`, `update()` | `purchase_receive` | `purchasereceive` |

The response types follow the same rename, so code indexing the generated types directly (for example `CreateSalesOrderResponse['sales_order']`) must use the new key.
