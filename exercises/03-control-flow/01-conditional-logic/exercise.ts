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

export type ApiResponse = ApiSuccess | ApiNotFound | ApiRateLimited | ApiServerError

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
	return Effect.succeed(undefined as A) // Replace with correct implementation
}

/**
 * TODO: Use Effect.filterOrFail to validate that age >= 18.
 * If valid, return the age.
 * If invalid, fail with "Must be at least 18 years old".
 */
export const filterAdult = (
	age: number,
): Effect.Effect<number, string> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
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
	return 0 // Replace with correct implementation
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
	// Your code here
	return Effect.succeed("") // Replace with correct implementation
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
	return Effect.succeed("") // Replace with correct implementation
}
