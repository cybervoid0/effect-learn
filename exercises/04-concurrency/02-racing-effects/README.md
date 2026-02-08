# Racing Effects

## Concept

Racing lets you run multiple effects concurrently and take the result of the **first one to complete**.
The losers are automatically interrupted — no resource leaks.

### `Effect.race` - First to finish wins
Runs two effects concurrently, returns the winner's result, interrupts the loser:
```typescript
const result = Effect.race(fastApi, slowApi)
// Whoever completes first wins, the other is cancelled
```

### `Effect.raceAll` - Race N effects
Same as `race` but for an iterable of effects:
```typescript
const fastest = Effect.raceAll([api1, api2, api3])
// First to complete wins, rest are interrupted
```

### `Effect.raceFirst` - Race including failures
Unlike `race`, `raceFirst` returns whichever effect **settles** first,
even if it fails:
```typescript
const result = Effect.raceFirst(fastButFlaky, slowButSafe)
// If fastButFlaky fails first, you get the failure
```

### `Effect.firstSuccessOf` - First to succeed
Tries effects one by one until one succeeds. Unlike `race`,
this is **sequential** — it only tries the next if the previous failed:
```typescript
const result = Effect.firstSuccessOf([primary, secondary, fallback])
// Tries primary first, then secondary, then fallback
```

### `Effect.timeout` - Race against the clock
A timeout is conceptually a race between your effect and a timer:
```typescript
const result = Effect.timeout(myEffect, "5 seconds")
// Effect<A, E | TimeoutException>
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **raceTwo** - Race two delayed effects, return the faster one's result
2. **raceWithFallback** - Race a fast-but-failing effect against a slow-but-safe one
3. **raceAll** - Race an array of effects, return the first result
4. **firstSuccessful** - Try effects sequentially until one succeeds
5. **withTimeout** - Add a timeout to an effect, return a default value on timeout

## Examples

```typescript
import { Effect } from "effect"

// Race: whoever is faster wins
const fast = Effect.sleep("100 millis").pipe(Effect.as("fast"))
const slow = Effect.sleep("500 millis").pipe(Effect.as("slow"))
const winner = Effect.race(fast, slow)
// Result: "fast"

// raceAll with multiple
const winner = Effect.raceAll([
  Effect.sleep("300 millis").pipe(Effect.as("A")),
  Effect.sleep("100 millis").pipe(Effect.as("B")),
  Effect.sleep("200 millis").pipe(Effect.as("C")),
])
// Result: "B"

// firstSuccessOf - sequential, not concurrent
const result = Effect.firstSuccessOf([
  Effect.fail("nope"),
  Effect.fail("also nope"),
  Effect.succeed("finally!"),
])
// Result: "finally!"

// Timeout with fallback
const result = Effect.sleep("10 seconds").pipe(
  Effect.as("data"),
  Effect.timeout("1 second"),
  Effect.catchTag("TimeoutException", () => Effect.succeed("timed out")),
)
// Result: "timed out"
```

## Hints

- `Effect.race` interrupts the loser automatically — no cleanup needed
- `Effect.raceFirst` settles on failure too, unlike `Effect.race`
- `Effect.firstSuccessOf` is sequential — use `Effect.raceAll` for concurrent racing
- `Effect.timeout` adds `TimeoutException` to the error channel
- Use `Effect.sleep` to simulate delays in your solutions
- Use `Effect.as` to replace a result: `Effect.sleep("100 millis").pipe(Effect.as("fast"))`

## Bonus

Try to:
- Race an effect against `Effect.interrupt` to see what happens
- Use `Effect.disconnect` to detach a fiber from interruption scope
- Combine `race` with `retry` for resilient concurrent operations
- Implement a "hedge request" pattern: start a second request after a delay
