# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Educational platform for learning the Effect library (functional programming for TypeScript). 47 exercises across 15 progressive levels, each with an exercise template, reference solution, tests, and README.

## Commands

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run a single exercise test
pnpm vitest run exercises/01-basics/01-creating-effects/exercise.test.ts

# Run all tests in a level
pnpm vitest run exercises/01-basics/

# Type-check the project
pnpm check

# Format/lint (uses Biome, not Prettier/ESLint)
pnpm biome check --write .

# Interactive exercise CLI
pnpm exercise
```

## Exercise Structure

Each exercise directory contains 4 files:
- `exercise.ts` — student template with TODOs to implement
- `solution.ts` — reference implementation
- `exercise.test.ts` — tests that import from `exercise.ts`
- `README.md` — concept explanation and assignment

Tests use `@effect/vitest` and vitest globals (no imports needed for `describe`/`it`/`expect`). Test helpers are in `exercises/test-utils.ts`.

## Code Style

- **Formatter**: Biome — tabs, 80-char width, LF line endings, trailing commas, semicolons as-needed
- **Module system**: ESM (`"type": "module"`) with Bundler resolution (extensionless imports)
- **TypeScript**: Strict mode with `exactOptionalPropertyTypes: true`
- **Arrow parens**: as-needed (`x => x` not `(x) => x`)

## Key Conventions

- Exercise tests import from `./exercise` (not solution) — no file extension needed
- Effects are executed in tests via `Effect.runSync()` / `Effect.runSyncExit()` or `@effect/vitest` helpers
- The `solutions` branch contains completed exercise implementations
