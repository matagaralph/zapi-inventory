---
'zapi-inventory': patch
---

Fixed shared token stores handing one user's access token to another. Stored tokens were looked up by `clientId` and `orgId` only, so two clients using the same OAuth app and organisation with different refresh tokens could use each other's access token and permissions. A stored token is now reused only when its `refreshToken` matches the client's own. Otherwise the client refreshes with its own grant. Custom `TokenStore` implementations must return the `refreshToken` they were given in `saveToken`.
