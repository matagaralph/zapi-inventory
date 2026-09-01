---
'zapi-inventory': minor
---

Added an experimental `getReportMetadata(path, params?)` method to the root SDK client. It fetches the `page_context` block Zoho returns for report style endpoints (pagination, applied filter, sort column and order, report name) for any resource path. The shape is marked `@experimental` and may still change.
