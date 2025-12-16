---
'zapi-inventory': major
---

- This release introduces a major cleanup of API types. Response schemas that previously only contained generic success messages are now correctly interpreted as 'void' returns, and their types are no longer generated.
- Consolidate separate single-item and bulk-item methods (e.g., `markAsConfirmed` and `bulkConfirm`) into a single, overloaded method that handles both scenarios based on the input array length. This simplifies the SDK's API surface and reduces redundancy.
- All future bug fixes and features will be released exclusively under the v2.x track.
