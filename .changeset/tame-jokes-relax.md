---
'zapi-inventory': patch
---

Added a TSDoc description to every SDK resource class, pulled from its OpenAPI spec, so hovering a module in an editor explains what it is for.

Shrank the published package by stripping `@example` JSDoc lines and the unused `webhooks` type from generated declarations, and by minifying the built JS bundles. No `@description` comment was touched.
