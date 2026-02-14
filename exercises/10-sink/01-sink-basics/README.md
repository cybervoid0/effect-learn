# Sink Basics

## Concept

A **Sink** in Effect is a consumer of stream elements. While `Stream.runCollect`
gathers everything into a `Chunk`, a `Sink` gives you fine-grained control over
how elements are consumed, aggregated, or reduced.

You run a stream into a sink with `Stream.run(stream, sink)`.

### Sink.collectAll

Collects all elements into a `Chunk`:

```typescript
const chunk = yield* Stream.run(
  Stream.make(1, 2, 3),
  Sink.collectAll(),
)
// Chunk(1, 2, 3)
```

### Sink.sum

Sums all numeric elements:

```typescript
const total = yield* Stream.run(Stream.make(10, 20, 30), Sink.sum)
// 60
```

### Sink.count

Counts the number of elements:

```typescript
const n = yield* Stream.run(Stream.make("a", "b", "c"), Sink.count)
// 3
```

### Sink.fold

Folds elements with an accumulator, optionally stopping early with a
continuation predicate:

```typescript
const result = yield* Stream.run(
  Stream.make(1, 2, 3, 4, 5),
  Sink.fold(0, (acc) => acc < 10, (acc, n) => acc + n),
)
// 10 (stops when accumulator >= 10)
```

### Sink.forEach

Runs a side effect for each element:

```typescript
yield* Stream.run(
  Stream.make(1, 2, 3),
  Sink.forEach((n) => Console.log(`Got: ${n}`)),
)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **collectAll** -- Run `[1, 2, 3, 4, 5]` into `Sink.collectAll()`, convert with `Chunk.toArray`. Return `[1, 2, 3, 4, 5]`.
2. **sumElements** -- Run `[10, 20, 30]` into `Sink.sum`. Return `60`.
3. **countElements** -- Run `["a", "b", "c", "d"]` into `Sink.count`. Return `4`.
4. **foldElements** -- Run `[1, 2, 3, 4, 5]` into `Sink.fold(0, acc => acc < 10, (acc, n) => acc + n)`. Return `10`.
5. **forEachSink** -- Run `[1, 2, 3]` into `Sink.forEach` that appends each element to a `Ref<number[]>`. Return `[1, 2, 3]`.

## Examples

```typescript
import { Chunk, Effect, Ref, Sink, Stream } from "effect"

// Collect all elements
const all = Effect.gen(function* () {
  const chunk = yield* Stream.run(
    Stream.make("x", "y", "z"),
    Sink.collectAll(),
  )
  return Chunk.toArray(chunk) // ["x", "y", "z"]
})

// Fold with early termination
const folded = Effect.gen(function* () {
  const result = yield* Stream.run(
    Stream.range(1, 100),
    Sink.fold(0, (acc) => acc < 50, (acc, n) => acc + n),
  )
  return result // stops when acc >= 50
})

// forEach with side effects
const logged = Effect.gen(function* () {
  const ref = yield* Ref.make<string[]>([])
  yield* Stream.run(
    Stream.make("a", "b"),
    Sink.forEach((s) => Ref.update(ref, (arr) => [...arr, s])),
  )
  return yield* Ref.get(ref) // ["a", "b"]
})
```

## Hints

- Use `Stream.run(stream, sink)` to run a stream into a sink
- `Sink.collectAll()` returns a `Chunk` -- use `Chunk.toArray` to convert
- `Sink.sum` expects a stream of numbers
- `Sink.fold(initial, continue, step)` -- `continue` returns `true` to keep folding
- `Sink.forEach` returns `void` -- use a `Ref` to track side effects in tests

## Bonus

- Try `Sink.take(n)` to consume only the first N elements
- Explore `Sink.head` to consume just the first element
- Use `Sink.last` to get only the last element from a stream
