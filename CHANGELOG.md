# zapi-inventory

## 2.0.1

### Patch Changes

- eb83f25: use correct resource name

## 2.0.0

### Major Changes

- e4612c4: - This release introduces a major cleanup of API types. Response schemas that previously only contained generic success messages are now correctly interpreted as 'void' returns, and their types are no longer generated.
  - Consolidate separate single-item and bulk-item methods (e.g., `markAsConfirmed` and `bulkConfirm`) into a single, overloaded method that handles both scenarios based on the input array length. This simplifies the SDK's API surface and reduces redundancy.
  - All future bug fixes and features will be released exclusively under the v2.x track.

## 1.1.0

### Minor Changes

- 29944f8: - Enforce required types in Zoho SDK to enable destructuring
  - Sync `billing_address` and `shipping_address` schemas with Zoho Inventory API properties
