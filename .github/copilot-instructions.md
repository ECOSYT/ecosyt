# Copilot instructions for ECOSYT

## Build, test, lint

- **Install:** `pnpm install` (requires Node >= 22.22.2 and pnpm 11)
- **Format check:** `pnpm format:check`
- **Lint:** `pnpm lint`
- **Typecheck:** `pnpm typecheck`
- **Test (all, excluding e2e/perf):** `pnpm test`
- **Coverage report:** `pnpm coverage:report`
- **Build:** `pnpm build`
- **Run a single test (package-level):**
  - `pnpm --filter @ecosyt/ast test -- path/to/test.spec.ts`
  - `pnpm --filter @ecosyt/web test -- -t "test name"`

## High-level architecture

- **Monorepo (pnpm + Turborepo)** with core system in `packages/` and deployable services in `apps/`.
- **AST-first core:** `packages/ast` is the source of truth; `packages/compiler` performs AST → IR → code; `packages/runtime` executes fine-grained reactive updates.
- **Collaboration:** `packages/sync` maps AST ↔ Yjs CRDT; `apps/sync-server` is a stateless WebSocket relay (Redis Pub/Sub for scale).
- **Product surface:** `packages/builder-ui` provides the React builder UI; `apps/web` hosts the frontend; `apps/api` (NestJS) handles auth, permissions, persistence, exports, and AI orchestration.
- **Directional deps:** `shared → ast → compiler → runtime → builder-ui → web`, with `sync` depending on AST/runtime and `api` depending on shared types/contracts.

## Key conventions

- **Immutability is mandatory:** never mutate objects in place; always return new structures.
- **Testing workflow is TDD with 80%+ coverage** across unit, integration, and E2E tests.
- **API response shape is standardized** (`success`, `data`, `error`, optional `meta` for pagination).
- **Prefer small, feature-scoped files** and organize by domain over type; avoid oversized modules.
