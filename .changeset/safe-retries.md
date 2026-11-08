---
'zapi-inventory': minor
---

`POST` and `PATCH` requests are no longer retried on `5xx` responses. Zoho may apply a create or email before returning a server error, so retrying could repeat the change up to three times. `GET`, `PUT` and `DELETE` are still retried on `5xx`, and every method is still retried on `429`, which Zoho returns without processing the request. Added a `retryTimes` option to `zAPI()` to change the number of retries, or disable them with `0`.
