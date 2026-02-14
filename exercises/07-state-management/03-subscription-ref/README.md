# SubscriptionRef

## Concept

A **SubscriptionRef** is a specialized `Ref` that allows subscribers to observe changes over time.
Each subscriber receives a `Stream` of values that emits whenever the ref is updated. This is ideal for reactive patterns where multiple consumers need to react to state changes.

### `SubscriptionRef.make` - Create a subscription reference
```typescript
const ref = yield* SubscriptionRef.make(0)
// SubscriptionRef<number> initialized to 0
```

### Reading and writing
`SubscriptionRef` works like a normal `Ref`:
```typescript
yield* SubscriptionRef.set(ref, 42)
const value = yield* SubscriptionRef.get(ref)
```

### `ref.changes` - Subscribe to changes
Returns a `Stream` that emits the current value followed by every subsequent update:
```typescript
const stream = ref.changes
// Stream<number> - emits current value, then every update
```

### Subscribing in a fiber
Typically you fork a subscriber that reads from `changes`, then update the ref from the main fiber:
```typescript
const subscriber = yield* Effect.fork(
  ref.changes.pipe(
    Stream.take(3),
    Stream.runCollect,
  )
)
yield* SubscriptionRef.set(ref, 1)
yield* SubscriptionRef.set(ref, 2)
const values = yield* Fiber.join(subscriber)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **createSubRef** - Create a `SubscriptionRef` initialized to `0`, get the initial value and return it
2. **updateAndRead** - Create a `SubscriptionRef("start")`, set it to `"end"`, get and return the value
3. **collectChanges** - Create a `SubscriptionRef(0)`, fork a subscriber that takes 3 values from `changes`, then set 1, 2, 3. Join the subscriber and return the collected values as an array
4. **multipleSubscribers** - Create a `SubscriptionRef(0)`, create 2 subscribers each taking 2 from `changes`, set 1 and 2, verify both get the same values
5. **trackHistory** - Create a `SubscriptionRef("a")`, fork a subscriber that takes 4 from `changes`, then set "b", "c", "d". Join and return the collected values as an array

## Examples

```typescript
import { Effect, SubscriptionRef, Stream, Fiber, Chunk } from "effect"

// Basic subscription
const example = Effect.gen(function* () {
  const ref = yield* SubscriptionRef.make(0)

  // Fork a subscriber that collects 3 values
  const subscriber = yield* Effect.fork(
    ref.changes.pipe(
      Stream.take(3),
      Stream.runCollect,
      Effect.map(Chunk.toArray),
    )
  )

  yield* SubscriptionRef.set(ref, 1)
  yield* SubscriptionRef.set(ref, 2)

  return yield* Fiber.join(subscriber)
  // [0, 1, 2] - initial value + 2 updates
})
```

## Hints

- `ref.changes` returns a `Stream` -- you need to `Stream.take(n)` and `Stream.runCollect` to materialize the values
- `Stream.runCollect` returns a `Chunk` -- use `Chunk.toArray` to convert
- Fork the subscriber BEFORE setting values, otherwise changes may be missed
- The first value emitted by `changes` is always the current value at subscription time
- Use `Effect.fork` and `Fiber.join` to run subscriber and producer concurrently

## Bonus

Try to:
- Create a subscriber that filters changes (only even numbers)
- Use `Stream.takeWhile` to stop subscribing on a specific condition
- Build a simple event log that records all changes to a ref
