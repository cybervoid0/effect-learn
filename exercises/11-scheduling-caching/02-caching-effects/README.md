# Caching Effects

## Concept

Effect provides built-in mechanisms to cache the results of effects so that expensive computations are only performed once. The key caching APIs are:

- **`Effect.cached`** - Returns an effect that, when evaluated, gives you a new effect whose result is memoized. The underlying effect runs only once; all subsequent evaluations return the cached result.
- **`Effect.once`** - Creates an effect that runs the underlying effect at most once. Subsequent executions are no-ops (return `void`).
- **`Ref<Option<A>>`** - You can implement manual caching by storing results in a `Ref` containing an `Option`. On first access, compute and store; on subsequent access, read the stored value.

Caching is useful for:
- Expensive computations that should only run once
- Shared state initialization
- Deduplicating side effects

## Assignment

Implement the following functions in `exercise.ts`:

1. **`cachedEffect`** - Use a `Ref` to track call count and `Effect.cached` to memoize an effect that increments and returns the count. Call the cached effect 3 times and return all three results as a tuple. All values should be identical.
2. **`uncachedEffect`** - Same setup but without caching. Call 3 times and return the tuple. Each call yields a different value.
3. **`cachedOnce`** - Use `Effect.once` to create an effect that increments a `Ref` at most once. Call it 3 times, then return the ref value (should be 1).
4. **`memoizedFunction`** - Use `Effect.cached` and call 5 times. Verify the call count is 1 and return `true`.
5. **`manualCache`** - Implement manual caching with `Ref<Option<number>>`. On first access compute a value (42), on subsequent access read the stored value. Return both access results as a tuple.

## Examples

```typescript
import { Effect, Ref } from "effect"

// Effect.cached usage
const program = Effect.gen(function* () {
  const getValue = yield* Effect.cached(Effect.succeed(Math.random()))
  const a = yield* getValue
  const b = yield* getValue
  // a === b (same cached value)
})

// Effect.once usage
const onceProgram = Effect.gen(function* () {
  const ref = yield* Ref.make(0)
  const doOnce = yield* Effect.once(Ref.update(ref, (n) => n + 1))
  yield* doOnce
  yield* doOnce // no-op
  return yield* Ref.get(ref) // 1
})
```

## Hints

- `Effect.cached` returns `Effect<Effect<A>>` -- you must yield the outer effect first to get the inner cached effect.
- `Effect.once` returns `Effect<Effect<void>>` -- the inner effect returns `void` (not the original value).
- For manual caching, use `Option.isNone` to check if the value has been computed yet.

## Bonus

- Explore `Effect.cachedWithTTL` to add time-based cache expiration.
- Think about how `Effect.cached` interacts with concurrency -- what happens when multiple fibers access it simultaneously?
