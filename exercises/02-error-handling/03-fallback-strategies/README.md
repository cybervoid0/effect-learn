# Fallback Strategies

## Concept

Effect provides powerful strategies for error handling through fallback, retry, and timeout.

### `orElse`
Tries an alternative Effect if the first one fails:
```typescript
const primary = Effect.fail("primary failed")
const fallback = Effect.succeed("fallback value")

const result = primary.pipe(Effect.orElse(() => fallback))
// Effect<string, never> - success with fallback value
```

### `retry`
Retries an Effect on error:
```typescript
import { Schedule } from "effect"

const unstable = Effect.fail("temporary error")

const withRetry = unstable.pipe(
  Effect.retry(Schedule.recurs(3)) // will try 3 times
)
```

### `timeout`
Sets a timeout on an operation:
```typescript
const slow = Effect.sleep("10 seconds").pipe(
  Effect.andThen(Effect.succeed("done"))
)

const withTimeout = slow.pipe(
  Effect.timeout("2 seconds") // will fail with TimeoutException after 2 seconds
)
```

### `timeoutTo`
Timeout with a fallback value:
```typescript
const result = slow.pipe(
  Effect.timeoutTo({
    duration: "2 seconds",
    onTimeout: () => Effect.succeed("timed out")
  })
)
```

### Combining Strategies
You can combine multiple strategies:
```typescript
const robust = riskyOperation.pipe(
  Effect.retry(Schedule.exponential("100 millis")),
  Effect.timeout("5 seconds"),
  Effect.orElse(() => fallbackOperation)
)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **withFallback** - try primary, if it fails - use fallback
2. **retryThreeTimes** - retry operation up to 3 times on error
3. **withTimeout** - add 1 second timeout to operation
4. **retryWithExponentialBackoff** - retry with exponential backoff
5. **robustOperation** - combination of retry + timeout + fallback

## Examples

```typescript
import { Effect, Schedule } from "effect"

// orElse - fallback
const withFallback = Effect.fail("error").pipe(
  Effect.orElse(() => Effect.succeed("fallback"))
)

// retry - simple
const withRetry = unstableOperation.pipe(
  Effect.retry(Schedule.recurs(3))
)

// retry - with policy
const withBackoff = unstableOperation.pipe(
  Effect.retry(
    Schedule.exponential("100 millis").pipe(
      Schedule.compose(Schedule.recurs(5))
    )
  )
)

// timeout
const withTimeout = slowOperation.pipe(
  Effect.timeout("5 seconds")
)

// timeoutTo - with fallback
const withTimeoutFallback = slowOperation.pipe(
  Effect.timeoutTo({
    duration: "5 seconds",
    onTimeout: () => Effect.succeed("default")
  })
)

// Combination
const robust = riskyOperation.pipe(
  Effect.retry(Schedule.recurs(3)),
  Effect.timeout("10 seconds"),
  Effect.orElse(() => fallbackOperation)
)
```

## Hints

- `orElse` accepts a function `() => Effect`
- `retry` accepts a `Schedule` - use `Schedule.recurs(n)`
- `timeout` accepts duration as a string: `"1 second"`, `"500 millis"`
- `Schedule.exponential` for exponential backoff
- `Schedule.compose` for combining schedules
- Order matters: usually retry → timeout → orElse

## Bonus

Try to:
- Create a custom Schedule with jitter
- Use `retryOrElse` to handle after all retries
- Add logging for each retry attempt
- Implement a circuit breaker pattern
- Use `Schedule.spaced` for fixed delay between retries
