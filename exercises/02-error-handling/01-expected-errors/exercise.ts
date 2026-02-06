import { Data, Effect, Schema } from "effect"

/**
 * TODO: Create an Effect that fails with a simple string error "Not implemented"
 */
export const createSimpleError = (): Effect.Effect<never, string> => {
	// Your code here
	return Effect.fail("Not implemented") // Replace with correct implementation
}

/**
 * TODO: Create a tagged error class called "DivisionByZeroError"
 * It should have no additional fields
 */
export class DivisionByZeroError extends Data.TaggedError(
	"DivisionByZeroError",
) {}

/**
 * TODO: Parse a string to a number
 * Return Effect.fail with "Invalid number" if the string is not a valid number
 */
export const parseNumber = (input: string): Effect.Effect<number, string> => {
	const schema = Schema.String.pipe(Schema.parseNumber)
	return Schema.decodeUnknown(schema)(input).pipe(
		Effect.mapError(() => "Invalid number"),
	)
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
	return b === 0
		? Effect.fail(new DivisionByZeroError())
		: Effect.succeed(a / b) // Replace with correct implementation
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
	return Effect.succeed(age).pipe(
		Effect.filterOrFail(
			(a) => a >= 0 && a <= 120,
			(a) =>
				new InvalidAgeError({
					age: a,
					reason: "Invalid age",
				}),
		),
	)
}
