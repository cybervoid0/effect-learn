# Parallel Execution

## Concept

Effect makes it trivial to run effects in parallel. The key is the `concurrency` option
available on combinators like `Effect.all` and `Effect.forEach`.

### `Effect.all` with concurrency
By default, `Effect.all` runs effects **sequentially**. Add `concurrency` to parallelize:
```typescript
// Sequential (default)
const sequential = Effect.all([fetchA, fetchB, fetchC])

// Fully parallel
const parallel = Effect.all([fetchA, fetchB, fetchC], {
  concurrency: "unbounded"
})

// Parallel with limit (at most 3 at a time)
const limited = Effect.all(effects, { concurrency: 3 })
```

### `Effect.forEach` with concurrency
Process a collection in parallel:
```typescript
const results = Effect.forEach(urls, (url) => fetchUrl(url), {
  concurrency: 5
})
```

### `{ mode: "validate" }` - Collect all errors
By default, `Effect.all` fails on the **first** error. With `mode: "validate"`,
it runs ALL effects and collects ALL errors:
```typescript
const result = Effect.all(validations, {
  concurrency: "unbounded",
  mode: "validate"
})
// Effect<Array<A>, Array<E>> — either all succeed, or you get ALL errors
```

### `Effect.timed` - Measure execution time
Wraps an effect and returns a tuple of `[Duration, A]`:
```typescript
const [duration, result] = yield* Effect.timed(myEffect)
// duration is a Duration object
```

### Sequential vs Parallel performance
```typescript
// Sequential: 300ms total (100 + 100 + 100)
const seq = Effect.all([delay100, delay100, delay100])

// Parallel: ~100ms total (all run at once)
const par = Effect.all([delay100, delay100, delay100], {
  concurrency: "unbounded"
})
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **parallelAll** - Run effects in parallel with unbounded concurrency
2. **parallelWithLimit** - Run effects in parallel with a concurrency limit
3. **parallelForEach** - Process a collection in parallel using `Effect.forEach`
4. **validateAll** - Run validations in parallel, collect ALL errors (not just the first)
5. **measureSpeedup** - Prove that parallel is faster than sequential using `Effect.timed`

## Examples

```typescript
import { Effect, Duration } from "effect"

// Parallel all
const results = Effect.all(
  [Effect.succeed(1), Effect.succeed(2), Effect.succeed(3)],
  { concurrency: "unbounded" }
)
// [1, 2, 3]

// Parallel forEach
const doubled = Effect.forEach(
  [1, 2, 3, 4, 5],
  (n) => Effect.succeed(n * 2),
  { concurrency: 3 }
)
// [2, 4, 6, 8, 10]

// Validate mode — collect all errors
const validated = Effect.all(
  [Effect.succeed(1), Effect.fail("err1"), Effect.fail("err2")],
  { concurrency: "unbounded", mode: "validate" }
)
// Fails with ["err1", "err2"] (both errors collected)

// Measure time
const timed = Effect.gen(function* () {
  const [duration, result] = yield* Effect.timed(myEffect)
  const ms = Duration.toMillis(duration)
  console.log(`Took ${ms}ms`)
  return result
})
```

## Hints

- `Effect.all` default is sequential — you MUST pass `concurrency` for parallelism
- `concurrency: "unbounded"` runs everything at once
- `concurrency: N` limits to N concurrent effects (like a semaphore)
- `mode: "validate"` changes the error type from `E` to `Array<E>`
- `Effect.timed` returns `[Duration, A]` — use `Duration.toMillis` to get milliseconds
- `Effect.forEach` is like `Array.map` but for effects, with optional concurrency

## Bonus

Try to:
- Compare `concurrency: 2` vs `concurrency: "unbounded"` execution times
- Use `Effect.all` with `{ mode: "either" }` to get `Array<Either<A, E>>`
- Implement a rate limiter using `concurrency` + `Effect.sleep`
- Try `Effect.allSuccesses` to get only the successful results
