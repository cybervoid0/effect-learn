# Transforming Effects

## Concept

Effect provides powerful operators for transforming and composing effects.

### `map`
Transforms the successful value of an Effect:
```typescript
const doubled = Effect.succeed(21).pipe(
  Effect.map(n => n * 2)
)
// Effect<number, never, never> -> 42
```

### `flatMap`
Chains dependent Effects (monadic composition):
```typescript
const getUserAge = (id: string) => Effect.succeed(25)
const canVote = (age: number) => Effect.succeed(age >= 18)

const result = getUserAge("123").pipe(
  Effect.flatMap(age => canVote(age))
)
```

### `andThen`
Universal operator for sequential composition:
```typescript
// With function
effect.pipe(Effect.andThen(x => Effect.succeed(x * 2)))

// With Effect
effect.pipe(Effect.andThen(Effect.succeed(42)))

// With constant
effect.pipe(Effect.andThen(42))
```

### `tap`
Executes a side-effect without changing the result:
```typescript
const logged = Effect.succeed(42).pipe(
  Effect.tap(n => Effect.sync(() => console.log(n)))
)
// Effect<number, never, never> -> 42 (but with logging)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. `doubleValue` - double the value of an Effect
2. `chainEffects` - create a chain of two Effects
3. `transformToString` - transform a number to a string
4. `logAndReturn` - log the value and return it
5. `calculateTotal` - complex composition of multiple operations

## Examples

```typescript
import { Effect } from "effect"

// map - simple transformation
const doubled = Effect.succeed(21).pipe(
  Effect.map(n => n * 2)
)

// flatMap - dependent operations
const divide = (a: number, b: number) =>
  b === 0 
    ? Effect.fail("Division by zero")
    : Effect.succeed(a / b)

const result = Effect.succeed(10).pipe(
  Effect.flatMap(x => divide(x, 2))
)

// tap - side effects
const withLogging = Effect.succeed(42).pipe(
  Effect.tap(n => Effect.sync(() => console.log(`Value: ${n}`)))
)

// Composition
const complex = Effect.succeed(5).pipe(
  Effect.map(n => n * 2),           // 10
  Effect.tap(n => Effect.log(n)),   // log: 10
  Effect.flatMap(n => 
    n > 5 
      ? Effect.succeed(n) 
      : Effect.fail("Too small")
  ),
  Effect.map(n => `Result: ${n}`)   // "Result: 10"
)
```

## Hints

- Use `map` for simple value transformations
- Use `flatMap` when the next operation returns an Effect
- Use `andThen` as a universal alternative
- Use `tap` for side-effects (logging, metrics)
- Use `pipe` for readable chains

## Bonus

Try to:
- Create a chain of 5+ operations
- Use `Effect.gen` instead of `pipe`
- Add error handling to the chain
- Implement retry logic with transformation
