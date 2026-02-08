# Conditional Logic

## Concept

Effect provides its own control flow tools that go beyond plain JavaScript `if-else`.
Use them when conditions involve Effects, when you need exhaustive checking, or when you need to filter/validate effectful values.

### `Effect.if` - Effect-based condition
When the **condition itself** is an Effect:
```typescript
const result = Effect.if(checkFeatureFlag(), {
  onTrue: () => fetchFromNewApi(),
  onFalse: () => fetchFromLegacyApi()
})
```

### `Effect.filterOrFail` - Validate or fail
Filters the success value or fails with an error:
```typescript
const adult = Effect.succeed(user).pipe(
  Effect.filterOrFail(
    u => u.age >= 18,
    (u) => new UnderageError({ age: u.age })
  )
)
```

### `Match.value` + `Match.exhaustive` - Exhaustive pattern matching
**The killer feature** - compiler guarantees you handled ALL variants:
```typescript
type Shape =
  | { _tag: "Circle"; radius: number }
  | { _tag: "Square"; side: number }

const area = (shape: Shape) =>
  Match.value(shape).pipe(
    Match.tag("Circle", ({ radius }) => Math.PI * radius ** 2),
    Match.tag("Square", ({ side }) => side ** 2),
    Match.exhaustive // Forgot a variant? Compile error!
  )
```

### `Match.value` with Effects
Combine pattern matching with effectful results:
```typescript
const handleError = (error: AppError) =>
  Match.value(error).pipe(
    Match.tag("NetworkError", (e) => Effect.retry(fetchData, retryPolicy)),
    Match.tag("AuthError", () => Effect.fail("Please login")),
    Match.tag("NotFound", () => Effect.succeed(defaultValue)),
    Match.exhaustive
  )
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **effectIf** - use `Effect.if` to choose between two Effects based on an Effect condition
2. **filterAdult** - use `Effect.filterOrFail` to validate age >= 18
3. **matchShape** - use `Match.value` + `Match.tag` + `Match.exhaustive` to calculate area
4. **handleApiResponse** - use `Match.value` with Effects to handle tagged API responses
5. **validateAndTransform** - combine `filterOrFail` and `Match` for a pipeline

## Examples

```typescript
import { Effect, Match, Data } from "effect"

// Effect.if - condition is an Effect
const greet = (checkPremium: Effect.Effect<boolean>) =>
  Effect.if(checkPremium, {
    onTrue: () => Effect.succeed("Welcome, premium user!"),
    onFalse: () => Effect.succeed("Welcome!")
  })

// filterOrFail - validate or fail
const ensurePositive = (n: number) =>
  Effect.succeed(n).pipe(
    Effect.filterOrFail(
      x => x > 0,
      () => "Must be positive"
    )
  )

// Match.exhaustive - compiler checks all cases
type Light = "red" | "yellow" | "green"

const action = (light: Light) =>
  Match.value(light).pipe(
    Match.when("red", () => "stop"),
    Match.when("yellow", () => "slow down"),
    Match.when("green", () => "go"),
    Match.exhaustive
  )

// Match with tagged unions and Effects
class Success extends Data.TaggedClass("Success")<{ data: string }> {}
class NotFound extends Data.TaggedClass("NotFound")<{ id: string }> {}
class ServerError extends Data.TaggedClass("ServerError")<{ code: number }> {}

type ApiResponse = Success | NotFound | ServerError

const handle = (response: ApiResponse) =>
  Match.value(response).pipe(
    Match.tag("Success", ({ data }) => Effect.succeed(data)),
    Match.tag("NotFound", ({ id }) => Effect.fail(`Not found: ${id}`)),
    Match.tag("ServerError", ({ code }) => Effect.fail(`Server error: ${code}`)),
    Match.exhaustive
  )
```

## Hints

- `Effect.if` takes an Effect<boolean> as condition, not a plain boolean
- `Effect.filterOrFail` predicate returns true to KEEP the value
- `Match.tag` matches on `_tag` field (works with `Data.TaggedClass` and `Data.TaggedError`)
- `Match.exhaustive` ensures ALL variants are handled at compile time
- `Match.when` works with predicates, literals, and object patterns
- Use `Data.TaggedClass` to create tagged union members

## Bonus

Try to:
- Add a new variant to a union and see `Match.exhaustive` catch it
- Use `Match.not` to match everything except a specific tag
- Combine multiple `filterOrFail` in a pipe chain
- Use `Match.whenOr` to handle multiple tags with the same handler
