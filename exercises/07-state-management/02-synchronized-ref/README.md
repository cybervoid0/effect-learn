# SynchronizedRef

## Concept

A **SynchronizedRef** extends `Ref` with the ability to perform **effectful** updates.
While `Ref.update` only accepts pure functions, `SynchronizedRef.updateEffect` lets you run effects (like API calls, logging, or delays) as part of the update. The update is serialized, meaning only one effectful update runs at a time.

### `SynchronizedRef.make` - Create a synchronized reference
```typescript
const ref = yield* SynchronizedRef.make(0)
// SynchronizedRef<number> initialized to 0
```

### `SynchronizedRef.get` / `SynchronizedRef.set`
Reading and writing work the same as `Ref`:
```typescript
const value = yield* SynchronizedRef.get(ref)
yield* SynchronizedRef.set(ref, 42)
```

### `SynchronizedRef.updateEffect` - Effectful update
Atomically updates the value using an effect:
```typescript
yield* SynchronizedRef.updateEffect(ref, (n) =>
  Effect.succeed(n + 1) // can be any effect
)
```

### `SynchronizedRef.modifyEffect` - Effectful modify
Like `Ref.modify`, but the function returns an effect producing the tuple:
```typescript
const result = yield* SynchronizedRef.modifyEffect(ref, (s) =>
  Effect.succeed([s.length, s + " world"])
)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **createSyncRef** - Create a `SynchronizedRef` initialized to `"initial"`, get and return the value
2. **effectfulUpdate** - Create a `SynchronizedRef` initialized to `0`, use `updateEffect` to add `10`, return the new value
3. **effectfulModify** - Create a `SynchronizedRef` initialized to `"hello"`, use `modifyEffect` to return the string's length while appending `" world"` to the stored value
4. **safeIncrement** - Given a `SynchronizedRef<number>`, use `updateEffect` to increment by 1 and return the new value
5. **concurrentUpdates** - Create a `SynchronizedRef(0)`, fork 10 fibers each incrementing by 1, join all fibers, return the final value

## Examples

```typescript
import { Effect, SynchronizedRef } from "effect"

// Effectful update
const example = Effect.gen(function* () {
  const ref = yield* SynchronizedRef.make(0)
  yield* SynchronizedRef.updateEffect(ref, (n) =>
    Effect.log(`Updating from ${n}`).pipe(Effect.as(n + 1))
  )
  return yield* SynchronizedRef.get(ref) // 1
})

// Effectful modify
const modifyExample = Effect.gen(function* () {
  const ref = yield* SynchronizedRef.make("hello")
  const length = yield* SynchronizedRef.modifyEffect(ref, (s) =>
    Effect.succeed([s.length, s.toUpperCase()] as const)
  )
  return length // 5
})
```

## Hints

- `SynchronizedRef` is a subtype of `Ref` -- you can use `Ref.get` and `Ref.set` on it too
- `updateEffect` returns `Effect<void>` -- to get the new value, follow up with a `get`
- `modifyEffect` function must return `Effect<[returnValue, newState]>`
- For concurrent updates, use `Effect.fork` in a loop and `Fiber.join` to wait for all
- Serialized updates mean concurrent `updateEffect` calls are safe by design

## Bonus

Try to:
- Compare performance of `SynchronizedRef` vs `Ref` under high contention
- Use `SynchronizedRef.updateEffect` to fetch data from an external source during update
- Chain multiple `SynchronizedRef` updates that depend on each other
