# Expected Errors

## Concept

In Effect, errors are **part of the type**. This means the compiler knows what errors a function can throw and forces you to handle them.

### Typed Errors

```typescript
Effect<Success, Error, Requirements>
//     ^^^^^^^  ^^^^^
//     What it returns  What errors it can throw
```

### `Effect.fail`
Creates an Effect that fails with a typed error:
```typescript
const error = Effect.fail("Something went wrong")
// Effect<never, string, never>
//       ^^^^^  ^^^^^^
//       never returns success, error type is string
```

### Tagged Errors (Data.TaggedError)
The recommended way to create errors in Effect:
```typescript
import { Data } from "effect"

class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly message: string
}> {}

const error = new NetworkError({ message: "Connection failed" })
```

### Multiple Error Types
Effect can have a union of error types:
```typescript
type AppError = NetworkError | ValidationError | DatabaseError

const program: Effect.Effect<User, AppError> = ...
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **createSimpleError** - create an Effect with a simple string error
2. **createTaggedError** - create a tagged error class and use it
3. **parseNumber** - parse a string to number, return error if invalid
4. **divideWithError** - divide numbers with typed error on division by zero
5. **validateAge** - validate age (must be >= 0 and <= 120)

## Examples

```typescript
import { Effect, Data } from "effect"

// Simple string error
const simpleError = Effect.fail("Oops!")

// Tagged error
class NotFoundError extends Data.TaggedError("NotFoundError")<{
  readonly id: string
}> {}

const notFound = Effect.fail(new NotFoundError({ id: "123" }))

// Function with typed error
const getUser = (id: string): Effect.Effect<User, NotFoundError> => {
  if (id === "unknown") {
    return Effect.fail(new NotFoundError({ id }))
  }
  return Effect.succeed({ id, name: "John" })
}

// Multiple error types
class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly field: string
}> {}

const validateAndFetch = (id: string): Effect.Effect<
  User,
  NotFoundError | ValidationError
> => {
  if (id.length === 0) {
    return Effect.fail(new ValidationError({ field: "id" }))
  }
  return getUser(id)
}
```

## Hints

- Use `Effect.fail` to create errors
- Use `Data.TaggedError` to create error classes
- `_tag` field is automatically added to tagged errors
- Error types are combined via `|` (union)
- Use `isNaN()` to check for valid numbers
- Use conditional logic for validation

## Bonus

Try to:
- Create an error hierarchy (base class + subclasses)
- Add additional fields to errors (timestamp, stack trace)
- Create a helper function for creating errors with context
- Use `Effect.gen` for composing functions with errors
