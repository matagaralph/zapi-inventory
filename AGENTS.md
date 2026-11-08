# zapi-inventory Development Guide

This repository contains a TypeScript SDK for Zoho Inventory, designed to work across runtimes with zero external runtime dependencies.

## Project Structure

- `packages/sdk` — The published Zoho Inventory SDK, including authentication, HTTP transport, resource operations, and tests.
- `packages/typegen` — Generates TypeScript request and response types from the Zoho OpenAPI specifications for the SDK.

## Commands

- ALWAYS use `pnpm` (never npm, yarn, or bun).
- NEVER run `pnpm test`; it runs all packages. Run focused tests from `packages/sdk` with `pnpm exec vitest run src/path/to/file.test.ts -t "<pattern>"`.
- Type check: `pnpm typecheck`.
- Build: `pnpm build`.
- Generate types: `pnpm generate`.
- Lint: `pnpm lint` (Oxlint).
- Check formatting: `pnpm format:check` (Oxfmt).
- Formatting and linting are checked by the Husky pre-commit hook. Do not bypass it.
- After changing a dependency version in `package.json` or `pnpm-workspace.yaml`, run `pnpm install --lockfile-only` from the affected workspace root to avoid unrelated lockfile updates. Verify with `pnpm install --frozen-lockfile`.
- Update the lockfile after adding or removing development dependencies as well.

## Writing Code

- NEVER use `any`, explicitly or implicitly, including in tests, tooling, and generated types.
- NEVER declare classes. Use functions, closures, typed objects, and composition.
- Do not bypass type safety with unsafe casts, chained assertions, or suppression comments.
- The published SDK must have zero external runtime dependencies. Keep development tools in `devDependencies`; do not bundle third-party runtime libraries or require them through peer or optional dependencies.
- The SDK must work across Node.js, Bun, Deno, and Cloudflare Workers. Avoid runtime-specific SDK APIs.
- Use native `fetch` for API and OAuth requests. Keep shared transport behaviour in `http.ts`.
- Use Oxlint and Oxfmt with the existing configurations. Preserve custom rules in `tools/oxlint/anti-slop/`.
- Use `Uint8Array` instead of `Buffer`, except in tests.
- Use `import type` for type-only imports.
- Use the `node:` protocol for Node.js built-ins in development tooling and tests.
- Add JSDoc comments for public APIs.
- Keep resource-specific changes in their resource module. Change shared code only when the behaviour is shared.

### Public API

- Keep the entry point `zAPI(options)`.
- Expose resource properties in lowercase: `salesorders`, `shipmentorders`, `purchaseorders`, and so on.
- Preserve established operation and configuration names, including `markAsConfirmed`, `orgId`, and `refreshToken`.
- Maintain typed inputs, inferred outputs, and public exports.
- Preserve response extraction conventions and distinguish SDK behaviour from the upstream API contract.

### Generated Types

- Change specifications or generator logic, then regenerate types. Do not manually patch generated output.
- Review generated diffs for unintended API changes and `any`.
- Keep type-only workspace imports out of emitted runtime code.
- Treat external JSON as unvalidated data. Use `unknown` and type guards where validation is needed; generic response types are not runtime validation.

## Issue Triage and Architecture

- Reproducing an error is only the first step. Establish which documented API, TypeScript, or runtime contract it violates before classifying it as a bug.
- Before changing public behaviour, inspect the relevant documentation, generated and inferred types, upstream specifications, release history, and implementation history.
- For reported regressions, compare the exact versions or tags involved.
- Distinguish SDK defects, upstream API errors, invalid caller input, and valid empty responses.
- Do not weaken input types or silently change response shapes to accommodate incorrect usage.
- When existing behaviour is intentional but unclear, improve documentation or error messages.
- Evaluate a proposed fix against the surrounding contract. Identify breaking changes explicitly.

## Testing

- Use Vitest. Keep tests beside the implementation as `*.test.ts`.
- Reuse `packages/sdk/test/fetch.ts` for controlled HTTP responses and `packages/sdk/test/module-inventory.ts` when checking resource coverage.
- Use fake credentials. Normal tests must not require live Zoho access.
- Test through `zAPI(options)` for public client behaviour and use focused unit tests for transport, authentication, errors, and token stores.
- Cover changed behaviour, including relevant failure paths.
- Preserve coverage for independent client state, token cache reuse, expiry, concurrent refresh, retries, timeouts, request construction, and response extraction.
- Verify public type contracts when changing input types, generated types, inference, or exports.
- For regression tests, reference a relevant issue or authoritative source with `@see` when available. Do not reference the current PR or its review comments.
- Put a shared `@see` above a focused `describe()` when several regression tests use the same reference. For one test, put it above `it()`.

## Important Development Notes

- Bug fixes and new features MUST include tests.
- For bug fixes, first confirm the behaviour violates the intended contract, then write a failing test before implementing the fix.
- Update `README.md`, `packages/sdk/README.md`, and relevant examples when changing the public API.
- Add a changeset for user-facing changes. Choose the appropriate release level and document breaking changes.
- Ensure relevant tests, `pnpm typecheck`, and `pnpm build` pass before finishing. Run lint and formatting checks when finishing without a commit.
- For packaging changes, inspect package contents, exports, declarations, and emitted JavaScript. Keep credentials, test fixtures, and development-only runtime imports out of the published package.
- Report failed or blocked checks accurately.
- DO NOT COMMIT unless the user explicitly asks.
- Do not push, publish, merge, or create a PR unless requested.
- Use Conventional Commits: `feat(scope):`, `fix(scope):`, `docs:`, `chore:`. Use `!` for breaking changes, for example `feat(sdk)!:`.
- PRs target `main`.
