# Challenge 2: Rate Limiter

## Goal

Build a rate limiter service that allows at most `maxCalls` requests
within a sliding `window` period. Excess calls are rejected with an error.

## Concepts Used

| Concept | From Level |
|---------|------------|
| `Ref` | 01 Basics |
| `Context.Tag` + `Layer.effect` | 06 Services |
| `Data.TaggedError` | 02 Error Handling |
| `Effect.filterOrFail` | 03 Control Flow |
| `Effect.fork` + `Fiber` | 04 Concurrency |
| `Effect.sleep` | 04 Concurrency |
| `Effect.addFinalizer` | 05 Resource Management |

## Specification

### Error

**RateLimited** — tagged error with:
- `remainingMs: number` — milliseconds until the window resets

### Service: `RateLimiter`

Tag: `"RateLimiter"`, interface:

- `attempt: <A>(effect: Effect<A>) => Effect<A, RateLimited>`
  If under the limit, increment counter and execute the effect.
  If at the limit, fail with `RateLimited`.

- `remaining: Effect<number>`
  How many calls are left in the current window.

- `reset: Effect<void>`
  Manually reset the counter to 0.

### Layer: `rateLimiterLive`

`(maxCalls: number, windowMs: number) => Layer<RateLimiter, never, Scope>`

Construction:
1. Create `Ref<{ count: number; windowStart: number }>` for state
2. Implement `attempt`:
   - Check if current time is past `windowStart + windowMs` → auto-reset
   - Check if `count < maxCalls` → increment and run effect
   - Otherwise → fail with `RateLimited`
3. Fork a background fiber that resets the counter every `windowMs`
4. Register finalizer to interrupt cleanup fiber

### Programs

**rateLimitedForEach** — execute a list of effects through the rate limiter.
Collect results: successful ones as `Either.right`, rate-limited as `Either.left`.

**retryAfterLimit** — attempt an effect. If rate-limited, sleep for
`remainingMs` and retry once.

## Hints

- State shape: `{ count: number; windowStart: number }`
- `Ref.modify` can atomically check + update in one step
- `Effect.flatMap` on RateLimited error to get `remainingMs` for retry
- `Effect.either` to collect successes and failures in `rateLimitedForEach`
