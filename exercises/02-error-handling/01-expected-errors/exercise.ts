import { Data, Effect } from "effect"

/**
 * TODO: Create an Effect that fails with a simple string error "Not implemented"
 */
export const createSimpleError = (): Effect.Effect<never, string> => {
	// Your code here
	return Effect.fail("") // Replace with correct implementation
}

/**
 * TODO: Create a tagged error class called "DivisionByZeroError"
 * It should have no additional fields
 */
export class DivisionByZeroError extends Data.TaggedError(
	"DivisionByZeroError",
)<{}> {}

/**
 * TODO: Parse a string to a number
 * Return Effect.fail with "Invalid number" if the string is not a valid number
 */
export const parseNumber = (
	input: string,
): Effect.Effect<number, string> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Divide two numbers
 * Return DivisionByZeroError if b is 0
 */
export const divideWithError = (
	a: number,
	b: number,
): Effect.Effect<number, DivisionByZeroError> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Create a tagged error for invalid age
 */
export class InvalidAgeError extends Data.TaggedError("InvalidAgeError")<{
	readonly age: number
	readonly reason: string
}> {}

/**
 * TODO: Validate age (must be >= 0 and <= 120)
 * Return InvalidAgeError with appropriate reason if invalid
 */
export const validateAge = (
	age: number,
): Effect.Effect<number, InvalidAgeError> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}
