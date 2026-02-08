import { Data, Effect, Match } from "effect"

// ── Tagged union types ──

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

export type ApiResponse = ApiSuccess | ApiNotFound | ApiRateLimited | ApiServerError

// ── Solutions ──

/**
 * Use Effect.if to choose between two Effects
 */
export const effectIf = <A>(
	condition: Effect.Effect<boolean>,
	successEffect: Effect.Effect<A>,
	fallbackEffect: Effect.Effect<A>,
): Effect.Effect<A> => {
	return Effect.if(condition, {
		onTrue: () => successEffect,
		onFalse: () => fallbackEffect,
	})
}

/**
 * Use Effect.filterOrFail to validate age >= 18
 */
export const filterAdult = (age: number): Effect.Effect<number, string> => {
	return Effect.succeed(age).pipe(
		Effect.filterOrFail(
			(a) => a >= 18,
			() => "Must be at least 18 years old",
		),
	)
}

/**
 * Use Match.value + Match.tag + Match.exhaustive to calculate area
 */
export const matchShape = (shape: Shape): number => {
	return Match.value(shape).pipe(
		Match.tag("Circle", ({ radius }) => Math.PI * radius * radius),
		Match.tag("Square", ({ side }) => side * side),
		Match.tag("Triangle", ({ base, height }) => 0.5 * base * height),
		Match.exhaustive,
	)
}

/**
 * Use Match.value + Match.tag + Match.exhaustive to handle API responses
 */
export const handleApiResponse = (
	response: ApiResponse,
): Effect.Effect<string, string> => {
	return Match.value(response).pipe(
		Match.tag("ApiSuccess", ({ data }) => Effect.succeed(data)),
		Match.tag("ApiNotFound", ({ id }) => Effect.fail(`Not found: ${id}`)),
		Match.tag("ApiRateLimited", ({ retryAfter }) =>
			Effect.fail(`Rate limited, retry after ${retryAfter}s`),
		),
		Match.tag("ApiServerError", ({ code }) =>
			Effect.fail(`Server error: ${code}`),
		),
		Match.exhaustive,
	)
}

/**
 * Combine filterOrFail and Match in a pipeline
 */
export const validateAndTransform = (
	age: number,
): Effect.Effect<string, string> => {
	return Effect.succeed(age).pipe(
		Effect.filterOrFail(
			(a) => a >= 0,
			() => "Invalid age",
		),
		Effect.map((a) =>
			Match.value(a).pipe(
				Match.when(
					(n) => n < 13,
					() => "child",
				),
				Match.when(
					(n) => n < 18,
					() => "teenager",
				),
				Match.when(
					(n) => n < 65,
					() => "adult",
				),
				Match.orElse(() => "senior"),
			),
		),
	)
}
