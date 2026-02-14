# Ref Basics

## Concept

A **Ref** is a mutable reference that can be safely shared between concurrent fibers.
Unlike regular variables, a `Ref` guarantees atomic updates, making it the primary building block for state management in Effect.

### `Ref.make` - Create a reference
Creates a new `Ref` with an initial value:
```typescript
const ref = yield* Ref.make(0)
// Ref<number> initialized to 0
```

### `Ref.get` - Read the value
Reads the current value of a `Ref`:
```typescript
const value = yield* Ref.get(ref) // 0
```

### `Ref.set` - Overwrite the value
Replaces the current value entirely:
```typescript
yield* Ref.set(ref, 42)
// ref now holds 42
```

### `Ref.update` - Transform the value
Applies a pure function to the current value:
```typescript
yield* Ref.update(ref, (n) => n + 1)
// ref incremented by 1
```

### `Ref.updateAndGet` - Transform and return
Like `update`, but also returns the new value:
```typescript
const newValue = yield* Ref.updateAndGet(ref, (n) => n + 5)
// newValue is the result after adding 5
```

### `Ref.modify` - Extract and transform
Atomically computes a return value AND updates the ref in one step.
The function returns a tuple `[returnValue, newState]`:
```typescript
const length = yield* Ref.modify(ref, (s) => [s.length, s.toUpperCase()])
// returns the old string's length, ref now holds the uppercased string
```

## Assignment

Implement the following functions in `exercise.ts`:

1. **createAndGet** - Create a `Ref` initialized to `0`, then read and return the value
2. **setAndGet** - Create a `Ref` initialized to `0`, set it to `42`, then read and return
3. **updateRef** - Create a `Ref` initialized to `10`, use `updateAndGet` to add `5`, return the result
4. **modifyRef** - Create a `Ref` initialized to `"hello"`, use `Ref.modify` to return the string's length and store the uppercased string
5. **counter** - Create a `Ref` initialized to `0`, increment it `n` times using `Effect.forEach`, return the final value

## Examples

```typescript
import { Effect, Ref } from "effect"

// Create, set, and get
const example = Effect.gen(function* () {
  const ref = yield* Ref.make("initial")
  yield* Ref.set(ref, "updated")
  return yield* Ref.get(ref) // "updated"
})

// Update atomically
const atomicUpdate = Effect.gen(function* () {
  const ref = yield* Ref.make(10)
  const result = yield* Ref.updateAndGet(ref, (n) => n * 2)
  return result // 20
})

// Modify: extract a value while transforming
const modifyExample = Effect.gen(function* () {
  const ref = yield* Ref.make([1, 2, 3])
  const length = yield* Ref.modify(ref, (arr) => [arr.length, [...arr, 4]])
  return length // 3 (array is now [1, 2, 3, 4])
})
```

## Hints

- `Ref.make(initial)` returns `Effect<Ref<A>>`, so you need to `yield*` it
- `Ref.modify` returns a tuple: the first element is the "return value", the second is the new state
- `Effect.forEach` with `{ discard: true }` is useful for repeating an action over a range
- Use `Effect.gen` to chain operations sequentially

## Bonus

Try to:
- Use `Ref.getAndSet` to swap a value and retrieve the old one
- Use `Ref.getAndUpdate` to atomically read the old value and apply a transformation
- Combine multiple Refs to build a small in-memory state machine
