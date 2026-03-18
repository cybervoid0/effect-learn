# Algebraic Data Types (ADTs)

## Concept

Algebraic Data Types (ADTs) are a powerful way to model data in functional programming. They allow you to create **precise, type-safe** representations of your domain. Effect provides several tools via `Data` module to create ADTs.

### What is an ADT?

An ADT is a composite type made of:
1. **Product types** - combining multiple values (like records/structs)
2. **Sum types** - choosing one of several alternatives (like tagged unions)

Together they form **discriminated unions** where each variant is identified by a tag.

### `Data.TaggedClass` - Manual Tagged Unions

Create a class that automatically gets a `_tag` field:

```typescript
import { Data } from "effect"

class Circle extends Data.TaggedClass("Circle")<{
  readonly radius: number
}> {}

class Square extends Data.TaggedClass("Square")<{
  readonly side: number
}> {}

type Shape = Circle | Square

const circle = new Circle({ radius: 5 })
// { _tag: "Circle", radius: 5 }
```

### `Data.TaggedError` - Error ADTs

Similar to `TaggedClass`, but for errors:

```typescript
class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly message: string
}> {}

const error = new NetworkError({ message: "Connection failed" })
// { _tag: "NetworkError", message: "Connection failed" }
```

### `Data.taggedEnum` - Declarative Tagged Unions

A more compact way to declare all variants at once (returns constructors and utilities):

```typescript
type Shape = Data.TaggedEnum<{
  Circle: { readonly radius: number }
  Square: { readonly side: number }
}>

const { Circle, Square, $is, $match } = Data.taggedEnum<Shape>()

const circle = Circle({ radius: 5 })
// Automatically has { _tag: "Circle", radius: 5 }
// + utility functions $is and $match for pattern matching
```

### Pattern Matching with ADTs

Use `Match` from Effect to safely handle all variants:

```typescript
import { Match } from "effect"

const area = (shape: Shape) =>
  Match.value(shape).pipe(
    Match.tag("Circle", ({ radius }) => Math.PI * radius ** 2),
    Match.tag("Square", ({ side }) => side ** 2),
    Match.exhaustive // Compiler ensures all variants handled!
  )
```

### `Data.struct` - Simple Records

Create a record with automatic equality and string representation:

```typescript
const user = Data.struct({
  name: "Alice",
  age: 30
})
// Immutable with value equality, nice toString()
```

### `Data.case` - Plain Objects with Equality

Like `struct` but simpler:

```typescript
const config = Data.case({ debug: true, port: 3000 })
```

## Assignment

Implement the following in `exercise.ts`:

1. **`createPoint`** - Use `Data.struct` to create a Point with x, y coordinates
2. **`createShape`** - Use `Data.TaggedClass` to create Circle and Square classes
3. **`calculateArea`** - Use `Match.exhaustive` to handle all Shape variants
4. **`createResult`** - Use `Data.taggedEnum` to create Success and Failure variants
5. **`handleResult`** - Use pattern matching to extract values from Result variants

## Examples

```typescript
import { Data, Match } from "effect"

// Structs for records
const point1 = Data.struct({ x: 0, y: 0 })
const point2 = Data.struct({ x: 0, y: 0 })
console.log(Data.equals(point1, point2)) // true - value equality!

// TaggedClass for union variants
class Success extends Data.TaggedClass("Success")<{ value: string }> {}
class Error extends Data.TaggedClass("Error")<{ code: number }> {}

type Response = Success | Error

// Pattern matching
const handle = (response: Response) =>
  Match.value(response).pipe(
    Match.tag("Success", ({ value }) => `Got: ${value}`),
    Match.tag("Error", ({ code }) => `Error ${code}`),
    Match.exhaustive
  )

// taggedEnum for compact declaration
type Result = Data.TaggedEnum<{
  Ok: { value: number }
  Err: { reason: string }
}>

const { Ok, Err, $is, $match } = Data.taggedEnum<Result>()

const result = Ok({ value: 42 })
console.log($is.Ok(result)) // true

// Pattern with taggedEnum
Match.value(result).pipe(
  Match.tag("Ok", ({ value }) => value * 2),
  Match.tag("Err", ({ reason }) => console.error(reason)),
  Match.exhaustive
)
```

## Hints

- `Data.struct` and `Data.case` provide value equality (not reference equality)
- `TaggedClass` requires creating a class that extends it
- `Data.taggedEnum` returns an object with constructors and utilities (`$is`, `$match`)
- `Match.exhaustive` ensures all variants are handled at compile time
- `_tag` field is automatically added and used by `Match.tag`
- Use `readonly` keyword on record fields for immutability

## Bonus

Try to:
- Create a nested ADT (ADT containing other ADTs)
- Use `Data.equals` to compare complex data structures
- Build a simple expression evaluator using ADTs
- Combine ADTs with Effect for typed domain models
