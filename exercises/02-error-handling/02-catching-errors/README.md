# Catching Errors

## Concept

Effect provides powerful operators for error handling. Unlike try-catch, error handling in Effect is **type-safe** and **composable**.

### `catchAll`
Catches all errors and recovers:
```typescript
const program = Effect.fail("error").pipe(
  Effect.catchAll(error => Effect.succeed("recovered"))
)
// Effect<string, never> - error handled!
```

### `catchTag`
Catches errors by tag (for tagged errors):
```typescript
class NetworkError extends Data.TaggedError("NetworkError")<{}> {}
class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

const program = riskyOperation.pipe(
  Effect.catchTag("NetworkError", () => Effect.succeed("network fallback"))
)
// Handles only NetworkError, ValidationError remains
```

### `catchSome`
Conditional error handling:
```typescript
const program = Effect.fail("error").pipe(
  Effect.catchSome(error => 
    error === "retryable" 
      ? Option.some(Effect.succeed("recovered"))
      : Option.none()
  )
)
```

### `match`
Pattern matching on Success/Failure:
```typescript
const result = program.pipe(
  Effect.match({
    onFailure: error => `Error: ${error}`,
    onSuccess: value => `Success: ${value}`
  })
)
// Effect<string, never> - always succeeds!
```

### `matchEffect`
Pattern matching with Effect in both cases:
```typescript
const result = program.pipe(
  Effect.matchEffect({
    onFailure: error => Effect.succeed(`Error: ${error}`),
    onSuccess: value => Effect.succeed(`Success: ${value}`)
  })
)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **recoverFromError** - catch any error and return a fallback value
2. **recoverFromSpecificError** - catch only NetworkError
3. **retryOnRetryableError** - conditionally handle "retryable" errors
4. **matchResult** - use match to transform Success/Failure into a string
5. **chainWithErrorHandling** - chain operations with error handling at each step

## Examples

```typescript
import { Effect, Data, Option } from "effect"

class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly message: string
}> {}

// catchAll - catches all errors
const safe = Effect.fail("oops").pipe(
  Effect.catchAll(() => Effect.succeed("recovered"))
)

// catchTag - catches by tag
const program = Effect.fail(new NetworkError({ message: "timeout" })).pipe(
  Effect.catchTag("NetworkError", (error) => 
    Effect.succeed(`Recovered from: ${error.message}`)
  )
)

// catchSome - conditional handling
const conditional = Effect.fail("error").pipe(
  Effect.catchSome(error => {
    if (error.startsWith("retry")) {
      return Option.some(Effect.succeed("retried"))
    }
    return Option.none()
  })
)

// match - pattern matching
const matched = Effect.succeed(42).pipe(
  Effect.match({
    onFailure: () => "failed",
    onSuccess: (n) => `success: ${n}`
  })
)

// Chain with error handling
const chain = Effect.succeed(10).pipe(
  Effect.flatMap(n => 
    n > 5 
      ? Effect.succeed(n * 2) 
      : Effect.fail("too small")
  ),
  Effect.catchAll(() => Effect.succeed(0))
)
```

## Hints

- `catchAll` accepts a function `(error) => Effect`
- `catchTag` only works with tagged errors
- `catchSome` returns `Option<Effect>` - use `Option.some` and `Option.none`
- `match` always returns a successful Effect
- You can combine multiple `catchTag` for different errors
- `Effect.gen` is convenient for complex chains with try-catch style

## Bonus

Try to:
- Use `catchTags` to handle multiple error types
- Create retry logic with `catchAll` + recursion
- Use `Effect.gen` with try-catch style handling
- Create a middleware pattern for centralized error handling
