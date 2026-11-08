---
'zapi-inventory': minor
---

`salesorders.create()` now accepts an optional `custom_shipping_address` for dropshipping orders that ship to an address not saved on the contact. It requires `attention`, `address`, `city`, `zip` and `country`, and optionally takes `company_name`, `street2`, `state` (a province code such as `BY`) and `phone`. Zoho's published spec omits this field, so it is added to the vendored spec.
