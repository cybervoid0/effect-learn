# Stream Basics

## Concept

A **Stream** in Effect is a lazy, potentially infinite sequence of values that can be
produced over time. Unlike an `Effect<A>` which produces a single value, a `Stream<A, E, R>`
can emit zero or more values of type `A`, may fail with `E`, and requires environment `R`.

Streams are built lazily -- no work happens until you **run** them. The simplest way
to consume a stream is `Stream.runCollect`, which gathers all emitted values into a `Chunk`.

### Creating streams

```typescript
// From explicit values
const s1 = Stream.make(1, 2, 3)

// From any Iterable (Array, Set, etc.)
const s2 = Stream.fromIterable([10, 20, 30])

// A range of integers (inclusive on both ends)
const s3 = Stream.range(1, 5) // 1, 2, 3, 4, 5

// An empty stream that emits nothing
const s4 = Stream.empty

// A single-element stream from an Effect
const s5 = Stream.fromEffect(Effect.succeed(42))
```

### Running streams

```typescript
// runCollect gathers everything into a Chunk
const chunk = yield* Stream.runCollect(Stream.make(1, 2, 3))

// Convert Chunk to a plain readonly array
const arr = Chunk.toReadonlyArray(chunk) // [1, 2, 3]
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **createSimpleStream** -- Create a stream of `1, 2, 3` with `Stream.make`, run it, and return the result as a readonly array.
2. **streamFromArray** -- Accept a readonly string array, create a stream with `Stream.fromIterable`, run and return as readonly array.
3. **rangeStream** -- Create a stream from 1 to 10 (inclusive) with `Stream.range`, run and return as readonly array.
4. **emptyStream** -- Create an empty stream with `Stream.empty`, run and return as readonly array.
5. **streamFromEffect** -- Create a single-element stream from `Effect.succeed(42)`, run and return as readonly array.

## Examples

```typescript
import { Chunk, Effect, Stream } from "effect"

// Basic pattern: create -> run -> convert
const program = Effect.gen(function* () {
  const chunk = yield* Stream.runCollect(Stream.make("a", "b", "c"))
  return Chunk.toReadonlyArray(chunk) // ["a", "b", "c"]
})

// From an iterable
const fromList = Effect.gen(function* () {
  const chunk = yield* Stream.runCollect(
    Stream.fromIterable(new Set([1, 2, 3]))
  )
  return Chunk.toReadonlyArray(chunk) // [1, 2, 3]
})
```

## Hints

- `Stream.runCollect` returns `Effect<Chunk<A>>`, so you need to `yield*` it inside `Effect.gen`
- `Chunk.toReadonlyArray` converts a `Chunk<A>` to `readonly A[]`
- `Stream.range(start, end)` is inclusive on both ends
- `Stream.empty` produces a stream that immediately completes with zero elements

## Bonus

- Try creating a stream from a generator function using `Stream.suspend`
- Explore `Stream.iterate` to build an infinite stream and take a finite prefix from it
- Use `Stream.runForEach` instead of `runCollect` to process elements one at a time
