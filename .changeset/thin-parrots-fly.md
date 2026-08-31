---
'zapi-inventory': major
---

**Breaking:** SDK methods whose Zoho response is only an acknowledgement (`{code, message}`, nothing else) now return `void` instead of that object. This covers most delete, submit, approve, void and mark-as-active/inactive operations across `batches`, `bills`, `compositeitems`, `contact-persons`, `contacts`, `credit-notes`, `currency`, `customer-payments`, `delivery-challans`, `inventoryadjustments`, `invoices`, `itemgroups`, `items`, `landedcosts`, `locations`, `moveorders`, `packages`, `picklists`, `pricelists`, `purchaseorders`, `purchasereceives`, `putaways`, `replenishment`, `reporting-tags`, `retainer-invoices`, `salesorders`, `shipmentorders`, `storagelocations`, `transferorders`, `users` and `vendor-credits`. Methods whose response carries real data beyond the ack (such as `salesorders.bulkConfirm`, which returns per-item email success/error info) are unaffected.

Also shrank the published package: the generated type declarations no longer carry unused `operations` fields (path/header params, request bodies, responses) for endpoints the SDK never reads that way, and test files no longer get their own `.d.ts` shipped. No exported type changed as a result.
