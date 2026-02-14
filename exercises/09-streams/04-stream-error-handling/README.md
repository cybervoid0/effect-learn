# Stream Error Handling

## Concept

Streams can fail just like effects. Effect provides several operators to handle
errors within a stream pipeline, allowing you to recover, fall back, retry, or
capture errors as values.

### catchAll

`Stream.catchAll` replaces a failed stream with an entirely new stream:

```typescript
const recovered = Stream.fail("boom").pipe(
  Stream.catchAll((err) => Stream.make(`recovered from: ${err}`)),
)
// emits "recovered from: boom"
```

### orElse

`Stream.orElse` switches to a fallback stream when the original fails:

```typescript
const withFallback = Stream.fail("err").pipe(
  Stream.orElse(() => Stream.make("fallback")),
)
// emits "fallback"
```

### retry

`Stream.retry` retries a failed stream according to a schedule:

```typescript
const retried = failingStream.pipe(
  Stream.retry(Schedule.recurs(3)),
)
```

### Partial failure

A stream may emit some elements before failing. `catchAll` lets you
recover and continue with a different stream:

```typescript
const partial = Stream.make(1, 2).pipe(
  Stream.concat(Stream.fail("oops")),
  Stream.catchAll(() => Stream.make(0)),
)
// emits 1, 2, 0
```

### Stream.either

`Stream.either` converts a `Stream<A, E>` into a `Stream<Either<A, E>, never>`,
turning errors into `Left` values and successes into `Right` values:

```typescript
const either = myStream.pipe(Stream.either)
// each element is Either.left(error) or Either.right(value)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **streamCatchAll** -- A failing stream (`Stream.fail("error")`) recovered with `catchAll` to emit `"recovered"`. Return `["recovered"]`.
2. **streamOrElse** -- A failing stream recovered with `orElse` to emit `"fallback"`. Return `["fallback"]`.
3. **streamWithRetry** -- Use a `Ref` to track attempts. The stream fails on the first attempt, succeeds on the second. Use `Stream.retry(Schedule.once)`. Return `["success"]`.
4. **partialStream** -- A stream emitting 1, 2 then failing, with `catchAll` recovering to emit 0. Return `[1, 2, 0]`.
5. **streamEither** -- A stream of numbers processed with `Stream.mapEffect` (succeed for even, fail for odd), wrapped in `Stream.either`. Return string representations of each `Either`.

## Examples

```typescript
import { Chunk, Effect, Either, Schedule, Stream } from "effect"

// catchAll recovery
const program = Effect.gen(function* () {
  const chunk = yield* Stream.fail("oops").pipe(
    Stream.catchAll(() => Stream.make("ok")),
    Stream.runCollect,
  )
  return Chunk.toReadonlyArray(chunk) // ["ok"]
})

// retry with schedule
const retried = Effect.gen(function* () {
  const ref = yield* Ref.make(0)
  const stream = Stream.fromEffect(
    Ref.getAndUpdate(ref, (n) => n + 1).pipe(
      Effect.flatMap((n) => n === 0 ? Effect.fail("retry") : Effect.succeed("done")),
    ),
  )
  const chunk = yield* stream.pipe(
    Stream.retry(Schedule.once),
    Stream.runCollect,
  )
  return Chunk.toReadonlyArray(chunk) // ["done"]
})
```

## Hints

- `Stream.catchAll` receives the error and must return a new stream of the same element type
- `Stream.orElse` takes a lazy thunk `() => Stream` as its fallback
- For `streamWithRetry`, create the stream with `Stream.fromEffect` wrapping a `Ref`-based effect
- `Stream.either` wraps each element in `Either.right` and each error in `Either.left`
- Use `Either.match` or pattern matching on `_tag` to convert `Either` values to strings

## Bonus

- Try `Stream.catchSome` to recover from only specific errors
- Use `Stream.onError` to log errors without changing the stream
- Explore `Stream.retry` with different schedules (exponential, spaced)
