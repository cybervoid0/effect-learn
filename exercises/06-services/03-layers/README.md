# Layers

## Concept

A **Layer** is a recipe for building a service. Layers describe how to construct
service implementations, what dependencies they need, and how to compose them
together into a complete application.

### `Layer.succeed` - Constant layer

Creates a layer from a plain value (no effects during construction):

```typescript
const ConfigLive = Layer.succeed(ConfigService, {
  host: "localhost",
  port: 8080,
})
```

### `Layer.effect` - Effectful layer

Creates a layer using an Effect (useful when construction needs side effects):

```typescript
const DbLive = Layer.effect(
  DbService,
  Effect.gen(function* () {
    const config = yield* ConfigService
    return { query: (sql: string) => Effect.succeed(`${config.host}: ${sql}`) }
  })
)
```

### `Layer.merge` - Combine independent layers

Merges two layers that provide different services:

```typescript
const AppLayer = Layer.merge(ConfigLive, LoggerLive)
// Layer providing ConfigService & LoggerService
```

### `Layer.provide` - Feed dependencies

When layer B depends on service A, provide A's layer to B:

```typescript
const DbLive = Layer.provide(DbLayer, ConfigLive)
// DbLayer gets its ConfigService from ConfigLive
```

### `Effect.provide` - Provide layer to a program

```typescript
const runnable = program.pipe(Effect.provide(AppLayer))
```

## Assignment

Implement the following in `exercise.ts`:

1. **ConfigService + configLayer** - Define a config service and create a `Layer.succeed`
2. **DbService + dbLayer** - Define a DB service and create a `Layer.effect` that uses ConfigService
3. **mergedLayer** - Merge configLayer with a provided loggerLayer using `Layer.merge`
4. **providedProgram** - An Effect that reads ConfigService, fully provided with configLayer
5. **fullStack** - Compose: configLayer feeds into dbLayer, merge with loggerLayer, provide to a program

## Examples

```typescript
import { Context, Effect, Layer } from "effect"

class Foo extends Context.Tag("Foo")<Foo, { readonly value: string }>() {}
class Bar extends Context.Tag("Bar")<Bar, { readonly greet: Effect.Effect<string> }>() {}

const FooLive = Layer.succeed(Foo, { value: "hello" })

const BarLive = Layer.effect(
  Bar,
  Effect.gen(function* () {
    const foo = yield* Foo
    return { greet: Effect.succeed(`${foo.value} world`) }
  })
)

// Compose: Bar needs Foo, so provide FooLive to BarLive
const BarProvided = Layer.provide(BarLive, FooLive)

const program = Effect.gen(function* () {
  const bar = yield* Bar
  return yield* bar.greet
})

Effect.runPromise(program.pipe(Effect.provide(BarProvided)))
```

## Hints

- `Layer.succeed(Tag, value)` creates a layer with no dependencies
- `Layer.effect(Tag, effectThatReturnsValue)` can access other services during construction
- `Layer.merge(a, b)` combines two independent layers
- `Layer.provide(consumer, dependency)` wires dependency into consumer
- `Effect.provide(layer)` eliminates the `R` requirement from an Effect

## Bonus

Try to:
- Create a three-layer dependency chain (A -> B -> C)
- Use `Layer.provideMerge` to provide and keep the dependency available
- Build a layer that acquires a resource with `Layer.scoped`
- Use `Layer.fresh` to prevent layer sharing
