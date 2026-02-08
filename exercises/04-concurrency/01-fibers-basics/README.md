# Fibers Basics

## Concept

A **Fiber** is a lightweight virtual thread managed by the Effect runtime.
Unlike OS threads, fibers are cheap to create (thousands of them can run simultaneously) and are cooperatively scheduled.

### `Effect.fork` - Spawn a fiber
Runs an effect concurrently in a new fiber:
```typescript
const fiber = Effect.fork(myEffect)
// Effect<Fiber<A, E>> - returns immediately, effect runs in background
```

### `Fiber.join` - Wait for result
Waits for a fiber to complete and returns its result (re-raising errors):
```typescript
const result = Effect.gen(function* () {
  const fiber = yield* Effect.fork(computeValue())
  // ... do other work ...
  return yield* Fiber.join(fiber) // wait for result
})
```

### `Fiber.await` - Wait for Exit
Like `join`, but returns an `Exit` instead of re-raising errors:
```typescript
const exit = yield* Fiber.await(fiber)
// Exit<A, E> - Success(value) or Failure(cause)
```

### `Fiber.interrupt` - Cancel a fiber
Cancels a running fiber. Effect guarantees safe cleanup via finalizers:
```typescript
yield* Fiber.interrupt(fiber)
// The fiber is cancelled, resources are released
```

### `Effect.forkDaemon` - Detached fiber
A daemon fiber is not tied to its parent scope — it keeps running even if
the parent completes or is interrupted:
```typescript
const daemonFiber = yield* Effect.forkDaemon(backgroundTask)
// Keeps running after parent exits
```

### Fiber status
You can inspect a fiber's current status:
```typescript
const status = yield* fiber.status
// FiberStatus: Running | Suspended | Done
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **forkAndJoin** - Fork an effect and retrieve its result via `Fiber.join`
2. **forkAndAwait** - Fork an effect and retrieve its `Exit` via `Fiber.await`
3. **interruptFiber** - Fork a long-running effect, then interrupt it
4. **forkDaemon** - Fork a daemon fiber that outlives the parent scope
5. **checkFiberStatus** - Fork an effect and check that the fiber is running

## Examples

```typescript
import { Effect, Fiber, FiberStatus } from "effect"

// Fork and join
const result = Effect.gen(function* () {
  const fiber = yield* Effect.fork(Effect.succeed(42))
  return yield* Fiber.join(fiber) // 42
})

// Fork and await
const exit = Effect.gen(function* () {
  const fiber = yield* Effect.fork(Effect.fail("boom"))
  return yield* Fiber.await(fiber) // Exit.Failure("boom")
})

// Interrupt a fiber
const interrupted = Effect.gen(function* () {
  const fiber = yield* Effect.fork(Effect.sleep("10 seconds"))
  yield* Fiber.interrupt(fiber) // cancels immediately
})

// Check fiber status
const isRunning = Effect.gen(function* () {
  const fiber = yield* Effect.fork(
    Effect.sleep("1 second").pipe(Effect.andThen(Effect.succeed("done")))
  )
  const status = yield* fiber.status
  return FiberStatus.isRunning(status) // true
})
```

## Hints

- `Effect.fork` returns `Effect<Fiber<A, E>>`, not the result directly
- `Fiber.join` re-raises the fiber's error in the parent effect
- `Fiber.await` gives you `Exit<A, E>` — use `Exit.isSuccess` / `Exit.isFailure`
- `Fiber.interrupt` returns an `Exit` (usually `Exit.Failure` with `Cause.Interrupt`)
- Fiber status is accessed via `fiber.status` (it's an Effect, not a property!)
- `Effect.forkDaemon` creates a fiber that is NOT interrupted when its parent completes

## Bonus

Try to:
- Fork multiple fibers and join them all
- Use `Fiber.interruptAll` to cancel a collection of fibers
- Inspect `Fiber.id` to see unique fiber identifiers
- Use `Effect.onInterrupt` to add cleanup logic when a fiber is interrupted
