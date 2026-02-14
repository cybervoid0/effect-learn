# Using Services

## Concept

Once a service is defined with `Context.Tag`, you can **use** it inside `Effect.gen`
by simply yielding the tag. This gives you the service implementation, which you
can then call like any other value.

### Accessing a service

```typescript
const program = Effect.gen(function* () {
  const random = yield* RandomService  // Accesses the service
  const value = yield* random.next     // Calls a method on it
  return value
})
```

The resulting effect has `RandomService` in its `R` (requirements) type parameter,
meaning it cannot be run until the service is provided.

### Combining multiple services

You can use as many services as you need in a single `Effect.gen` block:

```typescript
const program = Effect.gen(function* () {
  const random = yield* RandomService
  const logger = yield* LoggerService
  const value = yield* random.next
  yield* logger.log(`Got: ${value}`)
  return value
})
// Effect.Effect<number, never, RandomService | LoggerService>
```

The `R` type is a **union** of all required services.

### Providing services

Use `Effect.provide` with layers or `Layer.merge` for multiple services:

```typescript
const runnable = program.pipe(
  Effect.provide(Layer.merge(randomLive, loggerLive))
)
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **getRandomValue** - Use RandomService to get a random number
2. **logAndReturn** - Log "hello" using LoggerService, then return "done"
3. **getUserOrFallback** - Get user by id from UserRepository, return "Unknown" on error
4. **multiServiceProgram** - Use RandomService and LoggerService together: get random, log it, return it
5. **serviceWithMapping** - Get random value, multiply by 100, round to integer

## Examples

```typescript
import { Effect } from "effect"

// Single service
const getValue = Effect.gen(function* () {
  const svc = yield* MyService
  return yield* svc.getValue()
})

// Error recovery
const safe = Effect.gen(function* () {
  const repo = yield* UserRepo
  return yield* repo.find(id).pipe(
    Effect.catchAll(() => Effect.succeed("fallback"))
  )
})

// Multiple services
const combined = Effect.gen(function* () {
  const a = yield* ServiceA
  const b = yield* ServiceB
  const x = yield* a.compute()
  yield* b.record(x)
  return x
})
```

## Hints

- Yield the tag to get the service: `const svc = yield* MyService`
- Use `Effect.catchAll` to recover from errors in service calls
- `Effect.map` or `Effect.andThen` can transform results
- Multiple services create a union type in `R`
- `Math.round(x)` rounds a number to the nearest integer

## Bonus

Try to:
- Chain three or more services in a single generator
- Use `Effect.tap` to log without changing the return value
- Create a service method that calls another service internally
