# Sink Composition

## Concept

Sink composition allows you to build complex sinks by combining simpler ones. Effect provides utilities to:
- **Pipe** sinks together to transform their outputs
- **Combine** multiple sinks into one (e.g., running multiple reductions in parallel)
- **Chain** sinks to feed results into dependent operations
- **Filter** elements before they reach the sink

### Sink.pipe

Transform a sink's output by piping it through Effect operations:

```typescript
const evenSum = Sink.sum.pipe(Effect.map(n => n * 2))
// Sums elements, then doubles the result
```

### Sink.mapInput

Transform input elements **before** they hit the sink:

```typescript
const doubledSum = Sink.sum.pipe(
  Sink.mapInput((n: number) => n * 2)
)
// Doubles each number, then sums them
```

### Sink.filterInput

Filter elements before processing (keep only matching elements):

```typescript
const evenOnly = Sink.collectAll().pipe(
  Sink.filterInput((n: number) => n % 2 === 0)
)
// Collects only even numbers
```

### Sink.take

Consume only the first N elements:

```typescript
const first3 = yield* Stream.run(
  Stream.range(1, 100),
  Sink.take(3)
)
// [1, 2, 3]
```

### Sink.head / Sink.last

Get just the first or last element:

```typescript
const first = yield* Stream.run(stream, Sink.head())
const last = yield* Stream.run(stream, Sink.last())
```

## Assignment

Implement the following in `exercise.ts`:

1. **`filterAndCollect`** - Use `Sink.filterInput` to filter only even numbers, then collect them
2. **`transformedSum`** - Use `Sink.mapInput` to double each number before summing
3. **`filterByPredicate`** - Use `Sink.filterInput` with a custom predicate (> 15)
4. **`firstElements`** - Use `Sink.take(3)` to get first 3 elements
5. **`findFirst`** - Use `Sink.head` to find the first element

## Examples

```typescript
import { Chunk, Effect, Sink, Stream, Option } from "effect"

// Filter and collect
const evenNumbers = Effect.gen(function* () {
  const chunk = yield* Stream.run(
    Stream.make(1, 2, 3, 4, 5, 6),
    Sink.collectAll<number>().pipe(
      Sink.filterInput((n: number) => n % 2 === 0)
    )
  )
  return Chunk.toArray(chunk) // [2, 4, 6]
})

// Transform input with mapInput
const doubledSum = Effect.gen(function* () {
  const sum = yield* Stream.run(
    Stream.make(1, 2, 3, 4),
    Sink.sum.pipe(
      Sink.mapInput((n: number) => n * 2)
    )
  )
  return sum // (1*2 + 2*2 + 3*2 + 4*2) = 20
})

// Filter by custom predicate
const largeNumbers = Effect.gen(function* () {
  const chunk = yield* Stream.run(
    Stream.make(5, 10, 20, 25, 30),
    Sink.collectAll<number>().pipe(
      Sink.filterInput((n: number) => n > 15)
    )
  )
  return Chunk.toArray(chunk) // [20, 25, 30]
})

// Take first N
const firstThree = Effect.gen(function* () {
  const chunk = yield* Stream.run(
    Stream.range(1, 100),
    Sink.take(3)
  )
  return Chunk.toArray(chunk) // [1, 2, 3]
})

// Head
const firstElement = Effect.gen(function* () {
  const first = yield* Stream.run(
    Stream.make(100, 200, 300),
    Sink.head()
  )
  return Option.getOrElse(first, () => 0) // 100
})
```

## Hints

- `Sink.mapInput` transforms elements before the sink processes them
- `Sink.filterInput` filters elements (keep only when predicate returns true)
- `Sink.take(n)` returns a `Chunk` -- use `Chunk.toArray` to convert
- `Sink.head` returns an `Option` -- use `Option.getOrElse` to extract value
- Combine sinks with `.pipe()` to chain operations

## Bonus

- Try `Sink.fold` with a custom predicate to build a conditional aggregation
- Explore `Sink.filter` if available, or build your own using `contramap`
- Combine `take` with `head` to safely get the first element
- Use `Sink.dropLeft(n)` to skip the first N elements
