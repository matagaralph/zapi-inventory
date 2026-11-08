---
'zapi-inventory': patch
---

Fixed resource IDs being able to rewrite request URLs. Path segments were joined into the URL unencoded, so an ID such as `order-1?organization_id=other#` moved the SDK's `organization_id` into an unsent fragment and let the ID choose the organisation, and IDs containing `/` or `..` could reach other endpoints. Every path segment is now percent-encoded, and `.` or `..` segments reject with an `APIError` before any request is sent. Callers of `inventory.http` must pass each path segment separately (`['items', itemId]`, not `['items/' + itemId]`).
