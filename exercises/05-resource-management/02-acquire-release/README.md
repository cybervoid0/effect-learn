# Acquire-Use-Release Patterns

## Concept

Beyond basic scope management, Effect provides patterns for complex resource scenarios:
error-aware cleanup, one-shot resources, nested scopes, and interruption-safe finalization.

### `Effect.acquireUseRelease` - One-shot pattern
When you acquire, use, and release in a single step (no scope needed):
```typescript
const result = Effect.acquireUseRelease(
  openFile("data.txt"),           // Acquire
  (file) => file.readAll(),       // Use
  (file) => file.close()          // Release (always runs)
)
// No Scope required — self-contained lifecycle
```

### Error-aware release
The release function receives the `Exit` so you can react differently:
```typescript
Effect.acquireRelease(
  acquire,
  (resource, exit) =>
    Exit.isSuccess(exit)
      ? resource.close()
      : resource.rollback().pipe(Effect.andThen(resource.close()))
)
```

### `Effect.onExit` - React to how an effect ends
Runs a callback with the `Exit` after the effect completes:
```typescript
const tracked = myEffect.pipe(
  Effect.onExit((exit) =>
    Exit.isSuccess(exit)
      ? Effect.log("Success!")
      : Effect.log("Failed!")
  )
)
```

### `Effect.onInterrupt` - Only on interruption
Runs a callback only when the effect is interrupted (not on success/failure):
```typescript
const cancellable = longTask.pipe(
  Effect.onInterrupt(() => Effect.log("Task was cancelled"))
)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **acquireUseRelease** - Use the one-shot pattern to read from a mock file
2. **errorAwareRelease** - Release differently based on success vs failure
3. **onExitTracking** - Use `Effect.onExit` to track the outcome
4. **onInterruptCleanup** - Use `Effect.onInterrupt` for interruption-only cleanup
5. **nestedResources** - Nest `acquireUseRelease` calls and verify cleanup order

## Examples

```typescript
import { Effect, Exit } from "effect"

// One-shot: acquire, use, release
const readFile = Effect.acquireUseRelease(
  Effect.succeed({ name: "file.txt", content: "hello" }),
  (file) => Effect.succeed(file.content),
  (file) => Effect.log(`Closing ${file.name}`)
)

// Error-aware release
const transaction = Effect.acquireUseRelease(
  beginTransaction(),
  (tx) => executeQueries(tx),
  (tx, exit) =>
    Exit.isSuccess(exit) ? tx.commit() : tx.rollback()
)

// onExit — runs on any outcome
const monitored = doWork().pipe(
  Effect.onExit((exit) =>
    Effect.log(`Completed: ${exit._tag}`)
  )
)

// onInterrupt — only on interruption
const interruptAware = longComputation().pipe(
  Effect.onInterrupt(() =>
    Effect.log("Interrupted! Cleaning up...")
  )
)
```

## Hints

- `Effect.acquireUseRelease` does NOT require a `Scope` — it manages its own
- The release function in `acquireUseRelease` receives `(resource, exit)`
- `Effect.onExit` callback receives `Exit<A, E>` — check with `Exit.isSuccess`
- `Effect.onInterrupt` only fires on interruption, not on failure
- Nested `acquireUseRelease` releases inner first, then outer (LIFO)
- Use `Ref` to track events for testing

## Bonus

Try to:
- Implement a database transaction pattern with commit/rollback
- Use `Effect.acquireRelease` with `Effect.forkScoped` for background tasks
- Compare `ensuring` vs `onExit` vs `onInterrupt` behavior
- Create a resource pool using `Scope` and `Ref`
