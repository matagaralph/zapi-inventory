---
'zapi-inventory': patch
---

The `fetch` option is typed as the exported `FetchFunction` (`(input, init) => Promise<Response>`) instead of `typeof globalThis.fetch`. Under Bun's types, `typeof fetch` requires extra members such as `preconnect`, so a plain wrapper function failed to type-check. The native `fetch` is still accepted in every runtime.
