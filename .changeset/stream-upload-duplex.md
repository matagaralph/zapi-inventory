---
'zapi-inventory': patch
---

Fixed `ReadableStream` request bodies failing on Node.js with `RequestInit: duplex option is required when sending a body`. Stream bodies are now sent with `duplex: 'half'`, which Node's `fetch` requires and other runtimes accept.
