# Stream Transformations

## Concept

Once you have a stream, you can transform its elements using familiar combinators:
**map**, **filter**, **take**, and **drop**. These operators are lazy -- they build a
new stream description without pulling any data until you run it.

### Mapping

```typescript
// Transform each element
const doubled = Stream.make(1, 2, 3).pipe(Stream.map((x) => x * 2))
// emits 2, 4, 6
```

### Filtering

```typescript
// Keep only elements that pass the predicate
const evens = Stream.range(1, 10).pipe(Stream.filter((x) => x % 2 === 0))
// emits 2, 4, 6, 8, 10
```

### Take and Drop

```typescript
// Take only the first N elements
const first3 = Stream.range(1, 100).pipe(Stream.take(3))
// emits 1, 2, 3

// Skip the first N elements
const afterSkip = Stream.range(1, 10).pipe(Stream.drop(7))
// emits 8, 9, 10
```

### Chaining transformations

Transformations compose naturally with `pipe`:

```typescript
const result = Stream.range(1, 50).pipe(
  Stream.filter((x) => x % 3 === 0),
  Stream.map((x) => x * x),
  Stream.take(4),
)
// emits 9, 36, 81, 144
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **mapStream** -- Create a stream of 1, 2, 3 and map each element to double its value. Return the collected array `[2, 4, 6]`.
2. **filterStream** -- Create a stream from 1 to 10 and keep only even numbers. Return `[2, 4, 6, 8, 10]`.
3. **takeFromStream** -- Create a stream from 1 to 100 and take the first 5 elements. Return `[1, 2, 3, 4, 5]`.
4. **dropFromStream** -- Create a stream from 1 to 10 and drop the first 7 elements. Return `[8, 9, 10]`.
5. **chainTransformations** -- Create a stream from 1 to 20, filter even numbers, square each one, and take the first 3. Return `[4, 16, 36]`.

## Examples

```typescript
import { Chunk, Effect, Stream } from "effect"

// Map + collect
const program = Effect.gen(function* () {
  const chunk = yield* Stream.make(10, 20, 30).pipe(
    Stream.map((x) => x + 1),
    Stream.runCollect,
  )
  return Chunk.toReadonlyArray(chunk) // [11, 21, 31]
})

// Filter + take
const filtered = Effect.gen(function* () {
  const chunk = yield* Stream.range(1, 1000).pipe(
    Stream.filter((x) => x % 7 === 0),
    Stream.take(3),
    Stream.runCollect,
  )
  return Chunk.toReadonlyArray(chunk) // [7, 14, 21]
})
```

## Hints

- Use `pipe` to chain multiple transformations before calling `Stream.runCollect`
- `Stream.map` transforms each element; `Stream.filter` removes elements
- `Stream.take(n)` terminates the stream after `n` elements
- `Stream.drop(n)` discards the first `n` elements and emits the rest
- Order matters: `filter` then `map` is different from `map` then `filter`

## Bonus

- Try `Stream.mapAccum` to transform with state (e.g., running sum)
- Use `Stream.scan` to produce intermediate accumulations
- Explore `Stream.takeWhile` and `Stream.dropWhile` for predicate-based variants
