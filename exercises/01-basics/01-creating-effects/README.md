# Creating Effects

## Concept

In Effect, `Effect<A, E, R>` is a description of a computation that:
- Returns a value of type `A` on success
- Can fail with an error of type `E`
- Requires an environment (context) of type `R`

Effect is a **lazy** description of a program. It doesn't execute until you explicitly run it.

## Main Ways to Create Effects

### `Effect.succeed`
Creates an Effect that always successfully returns a value:
```typescript
const effect = Effect.succeed(42)
// Effect<number, never, never>
```

### `Effect.fail`
Creates an Effect that always fails with an error:
```typescript
const effect = Effect.fail("Oops!")
// Effect<never, string, never>
```

### `Effect.sync`
Creates an Effect from a synchronous function:
```typescript
const effect = Effect.sync(() => Math.random())
// Effect<number, never, never>
```

### `Effect.try`
Creates an Effect from a function that can throw an exception:
```typescript
const effect = Effect.try(() => JSON.parse('{"key": "value"}'))
// Effect<any, UnknownException, never>
```

### `Effect.promise`
Creates an Effect from a function returning a Promise:
```typescript
const effect = Effect.promise(() => fetch("https://api.example.com"))
// Effect<Response, never, never>
```

## Assignment

Implement the following functions in `exercise.ts`:

1. `createSuccessEffect` - creates an Effect returning the number 42
2. `createFailureEffect` - creates an Effect failing with error "Something went wrong"
3. `createRandomEffect` - creates an Effect returning a random number from 0 to 100
4. `createDateEffect` - creates an Effect returning the current date in ISO string format
5. `createDivisionEffect` - creates an Effect dividing two numbers (handle division by zero)

## Examples

```typescript
import { Effect } from "effect"

// Simple successful Effect
const greeting = Effect.succeed("Hello, Effect!")

// Effect with computation
const computation = Effect.sync(() => {
  console.log("Computing...")
  return 2 + 2
})

// Effect with possible error
const parseJSON = (text: string) =>
  Effect.try({
    try: () => JSON.parse(text),
    catch: (error) => new Error(`Parse error: ${error}`)
  })
```

## Hints

- Use `Effect.succeed` for simple values
- Use `Effect.sync` when you need to execute code that can't fail
- Use `Effect.try` when code can throw an exception
- For division by zero, use `Effect.fail` or conditional logic with `Effect.sync`

## Bonus

Try to create an Effect that:
- Reads the `NODE_ENV` environment variable
- Returns "development" if the variable is not set
- Uses `Effect.sync` and `process.env`
