# Looping

## Concept

Effect provides functional operators for loops and iterations.

### `Effect.loop`
Functional loop with accumulator:
```typescript
const sum = Effect.loop(
  0,                    // initial value
  {
    while: n => n < 5,  // continuation condition
    step: n => n + 1,   // next value
    body: (n, acc) => Effect.succeed(acc + n) // loop body
  }
)
// Effect<number> - sum 0+1+2+3+4 = 10
```

### `Effect.iterate`
Iteration with accumulator:
```typescript
const result = Effect.iterate(
  0,                    // initial value
  {
    while: n => n < 100,
    body: n => Effect.succeed(n + 1)
  }
)
// Effect<number> - 100
```

### `Effect.forEach`
Processing array elements:
```typescript
const numbers = [1, 2, 3, 4, 5]

const doubled = Effect.forEach(numbers, n => 
  Effect.succeed(n * 2)
)
// Effect<number[]> - [2, 4, 6, 8, 10]
```

### `Effect.forEach` with options
```typescript
// Sequential processing
Effect.forEach(items, process, { concurrency: 1 })

// Parallel processing
Effect.forEach(items, process, { concurrency: "unbounded" })

// Limited concurrency
Effect.forEach(items, process, { concurrency: 5 })

// Discard results
Effect.forEach(items, process, { discard: true })
```

### `Effect.all`
Combining array of Effects:
```typescript
const effects = [
  Effect.succeed(1),
  Effect.succeed(2),
  Effect.succeed(3)
]

const result = Effect.all(effects)
// Effect<number[]> - [1, 2, 3]
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **sumNumbers** - sum numbers from 1 to n using loop
2. **factorial** - factorial of a number using iterate
3. **processArray** - process array via forEach
4. **filterAndMap** - filter and transform array
5. **sequentialVsParallel** - compare sequential and parallel processing

## Examples

```typescript
import { Effect } from "effect"

// loop - с accumulator
const sum = Effect.loop(
  1,                        // start
  {
    while: n => n <= 5,     // while n <= 5
    step: n => n + 1,       // n++
    body: (n, acc) => Effect.succeed(acc + n)
  }
)
// 1 + 2 + 3 + 4 + 5 = 15

// iterate - проще чем loop
const countdown = Effect.iterate(
  10,
  {
    while: n => n > 0,
    body: n => Effect.succeed(n - 1)
  }
)
// 0

// forEach - обработка массива
const doubled = Effect.forEach(
  [1, 2, 3],
  n => Effect.succeed(n * 2)
)
// [2, 4, 6]

// forEach with filtering
const evenDoubled = Effect.forEach(
  [1, 2, 3, 4, 5],
  n => n % 2 === 0 
    ? Effect.succeed(n * 2)
    : Effect.fail("odd")
).pipe(
  Effect.catchAll(() => Effect.succeed([]))
)

// all - combining effects
const results = Effect.all([
  Effect.succeed(1),
  Effect.succeed(2),
  Effect.succeed(3)
])
// [1, 2, 3]
```

## Hints

- `Effect.loop` for loops with accumulator
- `Effect.iterate` for simple iterations without accumulator
- `Effect.forEach` for processing arrays
- `concurrency` option controls parallelism
- `discard: true` if results are not needed
- You can use `Effect.gen` with regular loops

## Bonus

Try to:
- Implement fibonacci via loop
- Use `Effect.forEach` with `concurrency: 2`
- Create a while-like loop via iterate
- Process array with possible errors
- Use `Effect.all` with object instead of array
