# Stream Combining

## Concept

Effect streams can be combined in several ways to build more complex data pipelines.

### Concatenation

`Stream.concat` appends one stream after another. The second stream starts only
after the first finishes:

```typescript
const s = Stream.concat(Stream.make(1, 2), Stream.make(3, 4))
// emits 1, 2, 3, 4
```

### Merging

`Stream.merge` interleaves two streams concurrently. The order of elements
depends on which stream produces faster -- it is non-deterministic:

```typescript
const merged = Stream.merge(streamA, streamB)
// emits elements from both, interleaved by arrival time
```

### Zipping

`Stream.zip` pairs elements positionally. The result stream ends when
either input ends:

```typescript
const zipped = Stream.zip(
  Stream.make("a", "b", "c"),
  Stream.make(1, 2, 3),
)
// emits ["a",1], ["b",2], ["c",3]
```

`Stream.zipWith` lets you combine the pair with a custom function:

```typescript
const summed = Stream.zipWith(
  Stream.make(1, 2, 3),
  Stream.make(10, 20, 30),
  (a, b) => a + b,
)
// emits 11, 22, 33
```

### FlatMap

`Stream.flatMap` maps each element to a sub-stream and flattens:

```typescript
const flat = Stream.make(1, 2, 3).pipe(
  Stream.flatMap((n) => Stream.make(n, n * 10)),
)
// emits 1, 10, 2, 20, 3, 30
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **concatStreams** -- Concatenate a stream of `[1, 2]` with a stream of `[3, 4]`. Return `[1, 2, 3, 4]`.
2. **mergeStreams** -- Merge two streams and verify the result contains all elements (check length = 6).
3. **zipStreams** -- Zip `["a", "b", "c"]` with `[1, 2, 3]` to produce tuples. Return `[["a", 1], ["b", 2], ["c", 3]]`.
4. **flatMapStream** -- FlatMap `[1, 2, 3]` so each `n` produces `[n, n * 10]`. Return `[1, 10, 2, 20, 3, 30]`.
5. **zipWithStream** -- ZipWith two number streams `[1, 2, 3]` and `[10, 20, 30]`, adding each pair. Return `[11, 22, 33]`.

## Examples

```typescript
import { Chunk, Effect, Stream } from "effect"

// Concat two streams
const program = Effect.gen(function* () {
  const chunk = yield* Stream.concat(
    Stream.make("x", "y"),
    Stream.make("z"),
  ).pipe(Stream.runCollect)
  return Chunk.toReadonlyArray(chunk) // ["x", "y", "z"]
})

// ZipWith to combine pairs
const added = Effect.gen(function* () {
  const chunk = yield* Stream.zipWith(
    Stream.make(1, 2),
    Stream.make(100, 200),
    (a, b) => a + b,
  ).pipe(Stream.runCollect)
  return Chunk.toReadonlyArray(chunk) // [101, 202]
})
```

## Hints

- `Stream.concat(s1, s2)` runs `s1` first, then `s2`
- `Stream.merge` is concurrent -- element order is non-deterministic, so test by checking length and set membership
- `Stream.zip` produces tuples `[A, B]` by pairing elements positionally
- `Stream.flatMap` with `concurrency: 1` (default) processes sub-streams sequentially
- `Stream.zipWith(s1, s2, f)` applies `f` to each pair of elements

## Bonus

- Try `Stream.zipAll` to handle streams of different lengths with defaults
- Explore `Stream.flatMap` with `concurrency` option for parallel sub-stream processing
- Use `Stream.cross` to compute the cartesian product of two streams
