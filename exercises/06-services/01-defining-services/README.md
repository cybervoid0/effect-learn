# Defining Services

## Concept

In Effect, **services** are typed dependencies. Instead of importing concrete
implementations, you declare abstract interfaces and let the caller provide
the implementation. This is Effect's dependency injection — the `R` in `Effect<A, E, R>`.

### Context.Tag - Declaring a service

```typescript
class MyService extends Context.Tag("MyService")<
  MyService,
  { readonly doSomething: (input: string) => Effect.Effect<string> }
>() {}
```

Three parts:
1. **String identifier** `"MyService"` — unique name for runtime
2. **Self-reference** `MyService` — first type param is the class itself
3. **Interface** — what the service can do

### Using a service

Yield the tag inside `Effect.gen` to access the implementation:

```typescript
const program = Effect.gen(function* () {
  const svc = yield* MyService          // Access service
  const result = yield* svc.doSomething("hello") // Use it
  return result
})
// Type: Effect<string, never, MyService>
//                              ^^^^^^^^ — requires MyService
```

### Layer.succeed - Providing an implementation

```typescript
const MyServiceLive = Layer.succeed(MyService, {
  doSomething: (input) => Effect.succeed(input.toUpperCase())
})

// Provide and run
Effect.runPromise(program.pipe(Effect.provide(MyServiceLive)))
```

## Assignment

Build a small key-value store application from scratch.

1. **KeyValueStore** - Define a service tag with interface:
   - `get: (key: string) => Effect.Effect<string, KeyNotFoundError>`
   - `set: (key: string, value: string) => Effect.Effect<void>`
   - `delete: (key: string) => Effect.Effect<void>`

2. **KeyNotFoundError** - Define a tagged error class using `Data.TaggedError`

3. **keyValueStoreLive** - Create a `Layer.effect` that builds an in-memory
   store using a `Ref<HashMap<string, string>>`

4. **getOrDefault** - Write a program that uses KeyValueStore:
   get a key, catch `KeyNotFoundError` and return a default value

5. **setAndGet** - Write a program that sets a key-value pair,
   then gets it back and returns the value

## Examples

```typescript
import { Context, Effect, Layer, Data, Ref, HashMap } from "effect"

// Define error
class NotFound extends Data.TaggedError("NotFound")<{
  readonly key: string
}> {}

// Define service
class Store extends Context.Tag("Store")<
  Store,
  { readonly load: (id: string) => Effect.Effect<string, NotFound> }
>() {}

// Create layer with internal state
const StoreLive = Layer.effect(
  Store,
  Effect.gen(function* () {
    const cache = yield* Ref.make(HashMap.empty<string, string>())
    return {
      load: (id) =>
        Ref.get(cache).pipe(
          Effect.andThen(HashMap.get(id)),
          Effect.andThen(
            Effect.mapError(() => new NotFound({ key: id }))
          )
        )
    }
  })
)
```

## Hints

- `Data.TaggedError("Name")<{ fields }>` creates a typed, tagged error
- `Layer.effect` lets you use Effects during layer construction (e.g. create a Ref)
- `Ref.make(HashMap.empty<K, V>())` creates mutable state for the store
- `HashMap.get` returns `Option` — use it with `Effect.mapError` or `Option.getOrThrow`
- The `R` type parameter automatically tracks which services are required

## Bonus

Try to:
- Add a `has: (key: string) => Effect.Effect<boolean>` method
- Add a `keys: Effect.Effect<Array<string>>` method
- Create a second implementation backed by a simple `Map` instead of `HashMap`
