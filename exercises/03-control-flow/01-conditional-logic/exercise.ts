import { Data, Effect, Match } from "effect"

// ── Tagged union types for exercises ──

export class Circle extends Data.TaggedClass("Circle")<{
	readonly radius: number
}> {}

export class Square extends Data.TaggedClass("Square")<{
	readonly side: number
}> {}

export class Triangle extends Data.TaggedClass("Triangle")<{
	readonly base: number
	readonly height: number
}> {}

export type Shape = Circle | Square | Triangle

export class ApiSuccess extends Data.TaggedClass("ApiSuccess")<{
	readonly data: string
}> {}

export class ApiNotFound extends Data.TaggedClass("ApiNotFound")<{
	readonly id: string
}> {}

export class ApiRateLimited extends Data.TaggedClass("ApiRateLimited")<{
	readonly retryAfter: number
}> {}

export class ApiServerError extends Data.TaggedClass("ApiServerError")<{
	readonly code: number
}> {}

export type ApiResponse =
	| ApiSuccess
	| ApiNotFound
	| ApiRateLimited
	| ApiServerError

// ── Exercises ──

/**
 * TODO: Use Effect.if to choose between two Effects
 * based on an Effect<boolean> condition.
 * If condition is true, return successEffect result.
 * If condition is false, return fallbackEffect result.
 */
export const effectIf = <A>(
	condition: Effect.Effect<boolean>,
	successEffect: Effect.Effect<A>,
	fallbackEffect: Effect.Effect<A>,
): Effect.Effect<A> => {
	// Your code here
	return Effect.if(condition, {
		onTrue: () => successEffect,
		onFalse: () => fallbackEffect,
	})
}

/**
 * TODO: Use Effect.filterOrFail to validate that age >= 18.
 * If valid, return the age.
 * If invalid, fail with "Must be at least 18 years old".
 */
export const filterAdult = (age: number): Effect.Effect<number, string> => {
	// Your code here
	return Effect.succeed(age).pipe(
		Effect.filterOrFail(
			(n) => n >= 18,
			() => "Must be at least 18 years old",
		),
	)
}

/**
 * TODO: Use Match.value + Match.tag + Match.exhaustive
 * to calculate area of a Shape.
 * - Circle: π * radius²
 * - Square: side²
 * - Triangle: 0.5 * base * height
 */
export const matchShape = (shape: Shape): number => {
	// Your code here
	return Match.value(shape).pipe(
		Match.tag("Circle", (c) => Math.PI * c.radius ** 2),
		Match.tag("Square", (s) => s.side ** 2),
		Match.tag("Triangle", (t) => 0.5 * t.base * t.height),
		Match.exhaustive,
	)
}
/**
 * TODO: Use Match.value + Match.tag + Match.exhaustive
 * to handle ApiResponse with Effects.
 * - ApiSuccess → succeed with data
 * - ApiNotFound → fail with "Not found: {id}"
 * - ApiRateLimited → fail with "Rate limited, retry after {retryAfter}s"
 * - ApiServerError → fail with "Server error: {code}"
 */
export const handleApiResponse = (
	response: ApiResponse,
): Effect.Effect<string, string> => {
	return Match.value(response).pipe(
		Match.tag("ApiSuccess", (x) => Effect.succeed(x.data)),
		Match.tag("ApiNotFound", (x) => Effect.fail(`Not found: ${x.id}`)),
		Match.tag("ApiRateLimited", (x) =>
			Effect.fail(`Rate limited, retry after ${x.retryAfter}s`),
		),
		Match.tag("ApiServerError", (x) => Effect.fail(`Server error: ${x.code}`)),
		Match.exhaustive,
	)
}

/**
 * TODO: Combine filterOrFail and Match in a pipeline.
 * 1. Filter: age must be >= 0 (fail with "Invalid age")
 * 2. Match the age category:
 *    - age < 13: "child"
 *    - age < 18: "teenager"
 *    - age < 65: "adult"
 *    - otherwise: "senior"
 */
export const validateAndTransform = (
	age: number,
): Effect.Effect<string, string> => {
	// Your code here
	return Effect.succeed(age).pipe(
		Effect.filterOrFail(
			(age) => age > 0,
			() => "Invalid age",
		),
		Effect.flatMap((filtered) =>
			Match.value(filtered).pipe(
				Match.when(
					(age) => age < 13,
					() => Effect.succeed("child"),
				),
				Match.when(
					(age) => age < 18,
					() => Effect.succeed("teenager"),
				),
				Match.when(
					(age) => age < 65,
					() => Effect.succeed("adult"),
				),
				Match.orElse(() => Effect.succeed("senior")),
			),
		),
	)
}
