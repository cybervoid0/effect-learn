# Schedule Basics

## Concept

Schedules in Effect define recurring patterns for repeating or retrying effects. A `Schedule` describes **when** and **how many times** an effect should be re-executed. Effect provides composable schedule constructors such as `Schedule.recurs` (fixed number of repetitions), `Schedule.spaced` (fixed delay between each), and `Schedule.exponential` (exponentially growing delay). You apply schedules via `Effect.repeat` (re-run on success) or `Effect.retry` (re-run on failure).

Key ideas:
- `Effect.repeat(schedule)` runs the effect once, then repeats according to the schedule on each **success**.
- `Effect.retry(schedule)` re-runs the effect according to the schedule on each **failure**.
- `Schedule.recurs(n)` allows up to `n` recurrences (so `n + 1` total executions when used with `repeat`).
- `Schedule.whileOutput(predicate)` continues the schedule only while the predicate on the output holds.
- `Effect.retryOrElse` retries with a schedule, then falls back to an alternative effect when retries are exhausted.

## Assignment

Implement the following functions in `exercise.ts`:

1. **`repeatNTimes`** - Create a `Ref` starting at 0, increment it, repeat 3 times with `Schedule.recurs(3)`, and return the final value. The initial execution plus 3 repeats should yield 4.
2. **`retryWithRecurs`** - Create a `Ref` tracking attempts. Build an effect that increments the ref and fails until attempts reach 3. Retry with `Schedule.recurs(5)`. Return the attempt count on success.
3. **`exponentialRetry`** - Create an exponential back-off schedule starting at `"10 millis"`, capped at 3 retries using `Schedule.compose(Schedule.recurs(3))`.
4. **`repeatWhile`** - Create a `Ref` at 0, increment it, and repeat while the value is less than 5 using `Schedule.whileOutput`.
5. **`retryOrElse`** - An effect that always fails, retried 2 times, with `Effect.retryOrElse` returning `"fallback"` when retries are exhausted.

## Examples

```typescript
import { Effect, Schedule, Ref } from "effect"

// Repeat an effect 2 times (3 total executions)
const example = Effect.gen(function* () {
  const ref = yield* Ref.make(0)
  yield* Ref.update(ref, (n) => n + 1).pipe(
    Effect.repeat(Schedule.recurs(2))
  )
  return yield* Ref.get(ref)
})
// Result: 3

// Retry a failing effect
const retryExample = Effect.fail("error").pipe(
  Effect.retry(Schedule.recurs(3))
)
```

## Hints

- `Schedule.recurs(n)` allows `n` recurrences. With `Effect.repeat`, the effect runs once initially plus `n` repeats.
- `Schedule.whileOutput` takes a predicate on the **output of the previous effect execution** to decide whether to continue.
- `Effect.retryOrElse` takes three arguments: the schedule, and a fallback function `(error, out) => Effect`.
- For `retryWithRecurs`, the effect should succeed (not fail) once the condition is met.

## Bonus

- Try combining `Schedule.exponential` with `Schedule.union` or `Schedule.intersect` to build complex retry strategies.
- Explore `Schedule.jittered` to add randomness to back-off schedules.
