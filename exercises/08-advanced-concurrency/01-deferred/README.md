# Deferred

## Concept

A **Deferred** is a one-shot synchronization primitive. It represents a value that will be available in the future. A `Deferred` can be completed exactly once -- either with a success value or a failure -- and any fiber that awaits it will block until the value is available.

Think of it as a promise that can be passed between fibers for coordination.

### `Deferred.make` - Create a deferred
```typescript
const deferred = yield* Deferred.make<string, Error>()
// Deferred<string, Error> - initially empty
```

### `Deferred.succeed` - Complete with a value
```typescript
yield* Deferred.succeed(deferred, "hello")
// Any fiber awaiting this deferred will receive "hello"
```

### `Deferred.fail` - Complete with an error
```typescript
yield* Deferred.fail(deferred, new Error("oops"))
// Any fiber awaiting this deferred will receive the error
```

### `Deferred.await` - Wait for the value
Blocks the current fiber until the deferred is completed:
```typescript
const value = yield* Deferred.await(deferred)
// Suspends until someone calls succeed or fail
```

### `Deferred.isDone` - Check completion status
Non-blocking check whether the deferred has been completed:
```typescript
const done = yield* Deferred.isDone(deferred) // false before completion
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **createAndComplete** - Create a `Deferred`, complete it with `"hello"`, then await and return the value
2. **deferredWithFailure** - Create a `Deferred`, fail it with `"error"`, await it and use `catchAll` to return the error message as a string
3. **waitForSignal** - Fork a fiber that awaits a `Deferred<number>`, then succeed the deferred with `42`, join the fiber and return
4. **isDoneCheck** - Create a `Deferred`, check `isDone` (expect false), then succeed it, check `isDone` again (expect true), return `[before, after]`
5. **handshake** - Create two Deferreds. Fork fiber 1: succeed d1 with "ping", await d2. Fork fiber 2: await d1, succeed d2 with "pong". Join both and return `[f1result, f2result]`

## Examples

```typescript
import { Effect, Deferred, Fiber } from "effect"

// Basic deferred usage
const basic = Effect.gen(function* () {
  const deferred = yield* Deferred.make<string, never>()
  yield* Deferred.succeed(deferred, "done")
  return yield* Deferred.await(deferred) // "done"
})

// Cross-fiber signaling
const signaling = Effect.gen(function* () {
  const deferred = yield* Deferred.make<number, never>()
  const waiter = yield* Effect.fork(Deferred.await(deferred))
  yield* Deferred.succeed(deferred, 42)
  return yield* Fiber.join(waiter) // 42
})

// Checking completion
const checking = Effect.gen(function* () {
  const deferred = yield* Deferred.make<string, never>()
  const before = yield* Deferred.isDone(deferred) // false
  yield* Deferred.succeed(deferred, "value")
  const after = yield* Deferred.isDone(deferred) // true
  return [before, after] as const
})
```

## Hints

- `Deferred.make<A, E>()` requires explicit type parameters for the success and error types
- `Deferred.succeed` and `Deferred.fail` return `Effect<boolean>` (true if first to complete)
- `Deferred.await` re-raises the error if the deferred was failed
- Use `Effect.catchAll` to recover from a failed deferred
- For the handshake, use two separate Deferreds for bidirectional communication

## Bonus

Try to:
- Use `Deferred.completeWith` to complete a deferred with an effect
- Create a timeout pattern: race `Deferred.await` against `Effect.sleep`
- Build a gate that blocks multiple fibers until a signal is given
