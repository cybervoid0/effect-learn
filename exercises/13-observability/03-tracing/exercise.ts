import { Effect, Option } from "effect"

/**
 * TODO: Wrap Effect.succeed(42) with a span named "compute".
 * Return 42.
 */
export const withSimpleSpan: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create an outer span "parent" that contains an inner span "child".
 * The inner effect can just succeed with any value.
 * Return "done" from the outer effect.
 */
export const nestedSpans: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Create a span "process", and inside it use
 * Effect.annotateCurrentSpan("userId", "123") to annotate the span.
 * Return "annotated".
 */
export const annotatedSpan: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Wrap Effect.sleep("10 millis") followed by returning "data"
 * in a span named "fetch".
 */
export const spanWithEffect: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Inside a span named "test", use Effect.currentSpan to get
 * the current span. Extract the span name using Option.map and
 * Option.getOrElse. Return the span name as a string.
 */
export const getCurrentSpan: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation
