# Running Effects

## Concept

Effect is a **lazy** description of a computation. To get the result, you need to **run** the Effect using one of the methods:

### `Effect.runSync`
Runs an Effect synchronously and returns the result. Throws an exception if the Effect fails or is asynchronous.
```typescript
const result = Effect.runSync(Effect.succeed(42))
// result: 42
```

### `Effect.runPromise`
Runs an Effect and returns a Promise with the result.
```typescript
const result = await Effect.runPromise(Effect.succeed(42))
// result: 42
```

### `Effect.runSyncExit`
Runs an Effect synchronously and returns an `Exit` - a data structure representing the result (success or failure).
```typescript
const exit = Effect.runSyncExit(Effect.succeed(42))
// exit: Exit.Success<42>
```

### `Effect.runFork`
Runs an Effect in a background Fiber and returns a `RuntimeFiber`.
```typescript
const fiber = Effect.runFork(Effect.succeed(42))
// fiber: RuntimeFiber<number, never>
```

## When to Use Which Method?

- **`runSync`** - when the Effect is definitely synchronous and can't fail
- **`runSyncExit`** - when you need to handle errors from a synchronous Effect
- **`runPromise`** - when the Effect is asynchronous or in async functions
- **`runFork`** - when you need to run an Effect in the background and continue execution

## Assignment

Implement the following functions in `exercise.ts`:

1. `runSimpleEffect` - run a synchronous Effect and return the result
2. `runEffectWithExit` - run an Effect and return the Exit result
3. `runAsyncEffect` - run an asynchronous Effect via Promise
4. `runEffectInBackground` - run an Effect in the background and return the Fiber

## Examples

```typescript
import { Effect } from "effect"

// Synchronous run
const value = Effect.runSync(Effect.succeed(42))
console.log(value) // 42

// With Exit handling
const exit = Effect.runSyncExit(Effect.fail("error"))
if (Exit.isFailure(exit)) {
  console.log("Failed!")
}

// Asynchronous run
await Effect.runPromise(
  Effect.promise(() => fetch("https://api.example.com"))
)

// Background run
const fiber = Effect.runFork(
  Effect.gen(function* () {
    yield* Effect.sleep("1 second")
    return "Done!"
  })
)
```

## Hints

- Use `Effect.runSync` for simple synchronous Effects
- Use `Effect.runSyncExit` when you need an `Exit` result
- Use `Effect.runPromise` for asynchronous Effects
- Use `Effect.runFork` for background tasks
- Don't forget `await` with `runPromise`

## Bonus

Try to:
- Run an Effect with a delay using `Effect.sleep`
- Get the result from a Fiber using `Fiber.await`
- Handle an error from Exit using `Exit.match`
