# Conditional Logic

## Concept

Effect provides functional operators for conditional logic that work with effects.

### `Effect.if`
Условное выполнение с Effect условием:
```typescript
const result = Effect.if(Effect.succeed(true), {
  onTrue: () => Effect.succeed("yes"),
  onFalse: () => Effect.succeed("no")
})
// Effect<string>
```

### `Effect.when`
Executes Effect only if condition is true:
```typescript
const maybeLog = Effect.when(shouldLog, () => 
  Effect.log("Logging enabled")
)
// Effect<Option<void>> - Some(void) if true, None if false
```

### `Effect.unless`
Executes Effect only if condition is false:
```typescript
const maybeError = Effect.unless(isValid, () =>
  Effect.fail("Invalid input")
)
```

### `Effect.filterOrFail`
Filters a value or fails with an error:
```typescript
const positive = Effect.succeed(-5).pipe(
  Effect.filterOrFail(
    n => n > 0,
    () => "Number must be positive"
  )
)
// Effect<number, string> - will fail with error
```

### Regular if-else with Effect
You can use regular JavaScript if:
```typescript
const result = (n: number) =>
  n > 0 
    ? Effect.succeed(n)
    : Effect.fail("negative")
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **conditionalEffect** - return "positive" if n > 0, otherwise "non-positive"
2. **logIfTrue** - log message only if condition is true
3. **failUnless** - fail with error if condition is false
4. **filterPositive** - filter positive numbers or fail
5. **complexConditional** - complex conditional logic with multiple checks

## Examples

```typescript
import { Effect, Option } from "effect"

// Simple if-else
const check = (n: number) =>
  n > 0 
    ? Effect.succeed("positive")
    : Effect.succeed("non-positive")

// Effect.if with Effect condition
const dynamic = Effect.if(Effect.succeed(true), {
  onTrue: () => Effect.succeed("yes"),
  onFalse: () => Effect.succeed("no")
})

// Effect.when - conditional execution
const maybeLog = Effect.when(true, () => 
  Effect.log("This will execute")
)
// Effect<Option<void>> - Some(void)

const noLog = Effect.when(false, () =>
  Effect.log("This won't execute")
)
// Effect<Option<void>> - None

// Effect.unless - inverse condition
const maybeError = Effect.unless(isValid, () =>
  Effect.fail("Invalid")
)

// filterOrFail
const onlyPositive = Effect.succeed(5).pipe(
  Effect.filterOrFail(
    n => n > 0,
    () => "Must be positive"
  )
)

// Complex logic
const validate = (age: number) =>
  age < 0
    ? Effect.fail("negative")
    : age > 120
    ? Effect.fail("too old")
    : age < 18
    ? Effect.succeed("minor")
    : Effect.succeed("adult")
```

## Hints

- Simple if-else with Effect works great
- `Effect.when` returns `Option` - use `Effect.flatMap` if you need to unwrap
- `Effect.unless` is the inverse of `Effect.when`
- `filterOrFail` is useful for validation
- You can combine multiple conditions via `Effect.gen`

## Bonus

Try to:
- Create a switch-case pattern with Effect
- Use `Effect.gen` for complex conditional logic
- Implement a guard pattern
- Create a validator with multiple conditions
