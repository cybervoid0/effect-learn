# Defining Services

## Concept

In Effect, **services** are typed dependencies that your effects can require.
Instead of importing concrete implementations directly, you declare abstract
service interfaces and let the caller provide the implementation.

### Context.Tag - Declaring a service

A service is defined using the class-based `Context.Tag` pattern. Each service
gets a unique string identifier and an interface describing its capabilities:

```typescript
import { Context, Effect } from "effect"

class Random extends Context.Tag("Random")<
  Random,
  { readonly next: Effect.Effect<number> }
>() {}
```

The type parameter structure is:
- First type param: the class itself (for self-referencing)
- Second type param: the service interface (what methods/values it exposes)

### Layer.succeed - Providing a concrete implementation

To create a concrete implementation of a service, use `Layer.succeed`:

```typescript
import { Layer } from "effect"

const RandomLive = Layer.succeed(
  Random,
  { next: Effect.sync(() => Math.random()) }
)
```

### Using a service in an effect

Use the service tag directly inside `Effect.gen` to access its interface:

```typescript
const program = Effect.gen(function* () {
  const random = yield* Random
  const value = yield* random.next
  return value
})
// program: Effect.Effect<number, never, Random>
```

### Providing the layer

Use `Effect.provide` to supply the implementation:

```typescript
const runnable = program.pipe(Effect.provide(RandomLive))
// runnable: Effect.Effect<number, never, never>
```

## Assignment

Implement the following in `exercise.ts`:

1. **RandomService** - Define a service tag with `next: Effect.Effect<number>`
2. **LoggerService** - Define a service tag with `log: (message: string) => Effect.Effect<void>`
3. **UserRepository** - Define a service tag with `getUser: (id: number) => Effect.Effect<string, Error>` and `getAllUsers: Effect.Effect<string[]>`
4. **randomServiceLive** - Create a `Layer.succeed` for RandomService that returns `Math.random()`
5. **programUsingRandom** - An Effect that uses RandomService to get a random number

## Examples

```typescript
import { Context, Effect, Layer } from "effect"

// Define a service
class Clock extends Context.Tag("Clock")<
  Clock,
  { readonly now: Effect.Effect<number> }
>() {}

// Create a layer
const ClockLive = Layer.succeed(Clock, { now: Effect.sync(() => Date.now()) })

// Use the service
const program = Effect.gen(function* () {
  const clock = yield* Clock
  const time = yield* clock.now
  return time
})

// Provide and run
const runnable = program.pipe(Effect.provide(ClockLive))
```

## Hints

- `Context.Tag` uses a class-based pattern: `class Foo extends Context.Tag("Foo")<Foo, Interface>() {}`
- The string identifier must be unique across your application
- `Layer.succeed` takes the tag and a concrete value matching the interface
- Use `Effect.sync` for side-effectful implementations (like `Math.random()`)
- When yielding a tag inside `Effect.gen`, you get the service interface back

## Bonus

Try to:
- Create a service with multiple methods and use them in a single program
- Define a service that depends on another service
- Experiment with `Layer.effect` to create a layer that itself requires services
- Observe how the `R` type parameter tracks all required services
