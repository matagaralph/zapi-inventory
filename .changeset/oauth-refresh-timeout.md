---
'zapi-inventory': patch
---

Token refreshes now time out. The OAuth request had no timeout and runs before an API request's own timer starts, so a stalled accounts server left every request waiting on that client's refresh hanging indefinitely. Refreshes now use the `timeout` option (10 seconds by default, and `0` disables it) and reject with an `APIError` such as `timeout of 10000ms exceeded`. The next request starts a new refresh.
