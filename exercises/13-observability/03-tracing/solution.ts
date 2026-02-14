import { Effect, Option } from "effect"

/**
 * Wrap Effect.succeed(42) in a span named "compute"
 */
export const withSimpleSpan: Effect.Effect<number> = Effect.succeed(42).pipe(
	Effect.withSpan("compute"),
)

/**
 * Nested spans: parent > child
 */
export const nestedSpans: Effect.Effect<string> = Effect.gen(function* () {
	yield* Effect.succeed("child-result").pipe(Effect.withSpan("child"))
	return "done"
}).pipe(Effect.withSpan("parent"))

/**
 * Annotated span with userId
 */
export const annotatedSpan: Effect.Effect<string> = Effect.gen(function* () {
	yield* Effect.annotateCurrentSpan("userId", "123")
	return "annotated"
}).pipe(Effect.withSpan("process"))

/**
 * Span wrapping a sleeping effect
 */
export const spanWithEffect: Effect.Effect<string> = Effect.sleep("10 millis").pipe(
	Effect.as("data"),
	Effect.withSpan("fetch"),
)

/**
 * Get the current span name inside a span
 */
export const getCurrentSpan: Effect.Effect<string> = Effect.gen(function* () {
	const spanOption = yield* Effect.currentSpan
	return spanOption.pipe(
		Option.map((span) => span.name),
		Option.getOrElse(() => "no-span"),
	)
}).pipe(Effect.withSpan("test"))
