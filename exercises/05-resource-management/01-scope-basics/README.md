# Scope Basics

## Concept

Resources (files, connections, locks) must be **acquired** and **released** safely —
even if your program crashes or gets interrupted. Effect provides `Scope` to guarantee
that cleanup always happens.

### The problem
```typescript
// Naive approach — if processData throws, connection leaks!
const conn = await db.connect()
const data = await conn.query("SELECT *")
await conn.close()
```

### `Effect.acquireRelease` - Safe resource lifecycle
Pairs an acquire effect with a release effect. The release **always** runs —
on success, failure, or interruption:
```typescript
const connection = Effect.acquireRelease(
  Effect.tryPromise(() => db.connect()),       // Acquire
  (conn) => Effect.promise(() => conn.close()) // Release (guaranteed)
)
```

### `Effect.scoped` - Run within a scope
Executes an effect that requires a `Scope` and closes it when done:
```typescript
const program = Effect.scoped(
  Effect.gen(function* () {
    const conn = yield* connection  // Acquired here
    const data = yield* conn.query("SELECT *")
    return data
  }) // conn.close() runs automatically here
)
```

### `Effect.ensuring` - Always run a finalizer
Attaches a finalizer that runs after the effect completes (success, failure, or interruption):
```typescript
const withCleanup = myEffect.pipe(
  Effect.ensuring(Effect.log("Cleanup complete"))
)
```

### `Effect.addFinalizer` - Register cleanup in scope
Registers a finalizer in the current scope:
```typescript
const program = Effect.gen(function* () {
  yield* Effect.addFinalizer((exit) =>
    Effect.log(`Finished with: ${exit._tag}`)
  )
  yield* doWork()
})
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **withEnsuring** - Attach a finalizer that always runs after the effect
2. **managedResource** - Create a resource with `acquireRelease` that tracks its lifecycle
3. **scopedResource** - Use `Effect.scoped` to safely acquire, use, and release a resource
4. **addFinalizerExample** - Use `Effect.addFinalizer` to register cleanup in the scope
5. **multipleResources** - Acquire multiple resources; verify they release in reverse order

## Examples

```typescript
import { Effect, Scope } from "effect"

// ensuring — always run cleanup
const program = Effect.succeed("result").pipe(
  Effect.ensuring(Effect.log("done!"))
)
// Logs "done!" whether the effect succeeds or fails

// acquireRelease — safe resource
const file = Effect.acquireRelease(
  Effect.sync(() => openFile("data.txt")),
  (handle) => Effect.sync(() => handle.close())
)

// scoped — execute and clean up
const result = Effect.scoped(
  Effect.gen(function* () {
    const f = yield* file
    return yield* readAll(f)
  })
)

// addFinalizer — register cleanup
const withFinalizer = Effect.scoped(
  Effect.gen(function* () {
    yield* Effect.addFinalizer(() => Effect.log("Scope closing"))
    return "work done"
  })
)

// Multiple resources — LIFO release order
const program = Effect.scoped(
  Effect.gen(function* () {
    const a = yield* resourceA  // acquired first
    const b = yield* resourceB  // acquired second
    return use(a, b)
  })
  // Released in reverse: b first, then a (like a stack)
)
```

## Hints

- `Effect.ensuring` runs its finalizer regardless of outcome
- `Effect.acquireRelease` requires a `Scope` — use `Effect.scoped` to provide it
- Release functions receive `exit: Exit<A, E>` — you can inspect success/failure
- `Effect.addFinalizer` also requires a `Scope` in context
- Multiple resources release in **reverse** order (LIFO) — like stack unwinding
- Use `Ref` to track events (acquire/release) for testing

## Bonus

Try to:
- Use `Effect.acquireUseRelease` for the one-shot acquire-use-release pattern
- Handle different `Exit` types in a release function
- Nest scopes and observe the release order
- Use `Effect.onInterrupt` vs `Effect.ensuring` and understand the difference
