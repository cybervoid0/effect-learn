# Spans and Tracing

## Concept

Tracing in Effect lets you instrument your code with spans that describe units of work. Spans can be nested to form a trace tree, annotated with metadata, and used to understand the flow and performance of your application.

Key tracing APIs:
- `Effect.withSpan` - wrap an effect in a named span
- `Effect.annotateCurrentSpan` - add key-value attributes to the current span
- `Effect.currentSpan` - access the current span (returns `Option<Span>`)
- Nested spans automatically form parent-child relationships

Unlike external tracing libraries, Effect's tracing is built in and does not require special setup for basic use. Spans are automatically propagated through the Effect runtime.

## Assignment

Implement the following functions in `exercise.ts`:

1. **`withSimpleSpan`** - Wrap `Effect.succeed(42)` with a span named "compute" and return 42.
2. **`nestedSpans`** - Create an outer span "parent" containing an inner span "child". Return "done".
3. **`annotatedSpan`** - Create a span "process", annotate it with `userId: "123"`, and return "annotated".
4. **`spanWithEffect`** - Wrap `Effect.sleep("10 millis")` followed by returning "data" in a span named "fetch".
5. **`getCurrentSpan`** - Inside a span named "test", get `Effect.currentSpan` and extract the span name. Return the span name as a string (use `Option.map` and `Option.getOrElse`).

## Examples

```typescript
import { Effect } from "effect"

// Simple span
const traced = Effect.succeed("result").pipe(Effect.withSpan("my-span"))

// Nested spans
const nested = Effect.gen(function* () {
	yield* Effect.succeed("inner").pipe(Effect.withSpan("child"))
	return "outer"
}).pipe(Effect.withSpan("parent"))

// Annotating spans
const annotated = Effect.gen(function* () {
	yield* Effect.annotateCurrentSpan("key", "value")
	return "done"
}).pipe(Effect.withSpan("operation"))
```

## Hints

- `Effect.withSpan("name")` is used as a pipe operator: `effect.pipe(Effect.withSpan("name"))`.
- `Effect.currentSpan` returns `Effect<Option<Span>>`. Use `Option.map(span => span.name)` to extract the name.
- `Effect.annotateCurrentSpan("key", "value")` returns `Effect<void>`.
- Spans are automatically nested when you compose effects.

## Bonus

- Try using `Effect.annotateCurrentSpan` with multiple attributes in the same span.
- Explore how spans compose across service boundaries using layers.
