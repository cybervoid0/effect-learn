import { Data, Effect } from "effect"

/**
 * Create an Effect that fails with a simple string error
 */
export const createSimpleError = (): Effect.Effect<never, string> => {
	return Effect.fail("Not implemented")
}

/**
 * Tagged error class for division by zero
 */
export class DivisionByZeroError extends Data.TaggedError(
	"DivisionByZeroError",
)<{}> {}

/**
 * Parse a string to a number
 */
export const parseNumber = (
	input: string,
): Effect.Effect<number, string> => {
	const num = Number(input)
	return Number.isNaN(num)
		? Effect.fail("Invalid number")
		: Effect.succeed(num)
}

/**
 * Divide two numbers with typed error
 */
export const divideWithError = (
	a: number,
	b: number,
): Effect.Effect<number, DivisionByZeroError> => {
	return b === 0
		? Effect.fail(new DivisionByZeroError())
		: Effect.succeed(a / b)
}

/**
 * Tagged error for invalid age
 */
export class InvalidAgeError extends Data.TaggedError("InvalidAgeError")<{
	readonly age: number
	readonly reason: string
}> {}

/**
 * Validate age
 */
export const validateAge = (
	age: number,
): Effect.Effect<number, InvalidAgeError> => {
	if (age < 0) {
		return Effect.fail(
			new InvalidAgeError({ age, reason: "Age cannot be negative" }),
		)
	}
	if (age > 120) {
		return Effect.fail(
			new InvalidAgeError({ age, reason: "Age cannot exceed 120" }),
		)
	}
	return Effect.succeed(age)
}
