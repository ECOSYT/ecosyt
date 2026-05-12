# Contributing

## Branching strategy

- `main`: production-ready branch (protected, PR-only)
- `develop`: integration branch (protected, PR-only)
- `feature/*`: new features
- `fix/*`: bug fixes
- `hotfix/*`: production hotfixes

## Commit conventions

This repository enforces Conventional Commits through `commitlint`.

Examples:

- `feat(api): add project bootstrap endpoint`
- `fix(sync): handle websocket reconnection`
- `chore(ci): harden quality gates`

## Local quality checks

Run before opening a PR:

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm coverage:report`
- `pnpm build`

## Pre-commit hooks

Install hooks once:

```bash
pre-commit install
pre-commit install --hook-type commit-msg
```

Hooks enforce formatting, linting, quick tests, commit message validation, and secret scanning.
