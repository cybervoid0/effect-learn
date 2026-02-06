# Combining Effects

## Concept

Effect provides powerful operators for combining multiple effects.

### `Effect.zip`
Combines two Effects into a tuple:
```typescript
const a = Effect.succeed(1)
const b = Effect.succeed("hello")

const combined = Effect.zip(a, b)
// Effect<[number, string]> - [1, "hello"]
```

### `Effect.zipWith`
Combines two Effects with a function:
```typescript
const sum = Effect.zipWith(
  Effect.succeed(2),
  Effect.succeed(3),
  (a, b) => a + b
)
// Effect<number> - 5
```

### `Effect.all`
Combines array or object of Effects:
```typescript
// Array
const array = Effect.all([
  Effect.succeed(1),
  Effect.succeed(2),
  Effect.succeed(3)
])
// Effect<[number, number, number]>

// Object
const object = Effect.all({
  name: Effect.succeed("John"),
  age: Effect.succeed(25)
})
// Effect<{ name: string, age: number }>
```

### `Effect.struct`
Alias for `Effect.all` with object:
```typescript
const user = Effect.struct({
  id: Effect.succeed(1),
  name: Effect.succeed("John"),
  email: Effect.succeed("john@example.com")
})
// Effect<{ id: number, name: string, email: string }>
```

### `Effect.tuple`
Alias for `Effect.all` with array:
```typescript
const data = Effect.tuple(
  Effect.succeed(1),
  Effect.succeed("hello"),
  Effect.succeed(true)
)
// Effect<[number, string, boolean]>
```

### Combining Options
```typescript
// Sequential execution
Effect.all(effects, { concurrency: 1 })

// Parallel execution
Effect.all(effects, { concurrency: "unbounded" })

// Limited concurrency
Effect.all(effects, { concurrency: 5 })

// Fail fast (stop on first error)
Effect.all(effects, { mode: "default" })

// Collect all errors
Effect.all(effects, { mode: "validate" })
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **zipTwo** - combine two Effects into a tuple using zip
2. **zipWithSum** - combine two numbers and sum them using zipWith
3. **combineArray** - combine array of Effects using all
4. **combineObject** - combine object of Effects using struct
5. **parallelFetch** - simulate parallel requests with concurrency limit

## Examples

```typescript
import { Effect } from "effect"

// zip - simple combining
const pair = Effect.zip(
  Effect.succeed(42),
  Effect.succeed("answer")
)
// [42, "answer"]

// zipWith - with transformation
const sum = Effect.zipWith(
  Effect.succeed(10),
  Effect.succeed(32),
  (a, b) => a + b
)
// 42

// all with array
const numbers = Effect.all([
  Effect.succeed(1),
  Effect.succeed(2),
  Effect.succeed(3)
])
// [1, 2, 3]

// all with object (or struct)
const user = Effect.all({
  id: Effect.succeed(1),
  name: Effect.succeed("John"),
  verified: Effect.succeed(true)
})
// { id: 1, name: "John", verified: true }

// tuple - alternative syntax
const data = Effect.tuple(
  Effect.succeed(1),
  Effect.succeed("hello")
)
// [1, "hello"]

// Parallelism
const parallel = Effect.all(
  [task1, task2, task3],
  { concurrency: "unbounded" }
)

// Limited concurrency
const limited = Effect.all(
  [task1, task2, task3, task4, task5],
  { concurrency: 2 } // maximum 2 at once
)

// Collect all errors
const validated = Effect.all(
  [validation1, validation2, validation3],
  { mode: "validate" }
)
```

## Hints

- `zip` for two Effects
- `zipWith` when you need to transform the result immediately
- `all` for arrays and objects
- `struct` - more explicit alias for objects
- `tuple` - more explicit alias for arrays
- `concurrency` option controls parallelism
- `mode: "validate"` collects all errors instead of fail-fast

## Bonus

Try to:
- Use `Effect.validate` to collect all validation errors
- Combine `zip` with `map` for complex transformations
- Create nested structures with `all`
- Use `Effect.forEach` + `Effect.all` for complex patterns
- Measure execution time difference sequential vs parallel
