import { Effect, Option } from "effect"

/**
 * TODO: Return "positive" if n > 0, otherwise "non-positive"
 */
export const conditionalEffect = (
	n: number,
): Effect.Effect<string> => {
	// Your code here
	return Effect.succeed("") // Replace with correct implementation
}

/**
 * TODO: Log the message only if condition is true
 * Return Effect<Option<void>>
 */
export const logIfTrue = (
	condition: boolean,
	message: string,
): Effect.Effect<Option.Option<void>> => {
	// Your code here
	return Effect.succeed(Option.none()) // Replace with correct implementation
}

/**
 * TODO: Fail with the error message if condition is false
 * Otherwise succeed with void
 */
export const failUnless = (
	condition: boolean,
	errorMessage: string,
): Effect.Effect<void, string> => {
	// Your code here
	return Effect.succeed(undefined) // Replace with correct implementation
}

/**
 * TODO: Filter positive numbers or fail with "Number must be positive"
 */
export const filterPositive = (
	n: number,
): Effect.Effect<number, string> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Complex conditional logic
 * - If n < 0: fail with "negative"
 * - If n === 0: succeed with "zero"
 * - If n < 10: succeed with "small"
 * - If n < 100: succeed with "medium"
 * - Otherwise: succeed with "large"
 */
export const complexConditional = (
	n: number,
): Effect.Effect<string, string> => {
	// Your code here
	return Effect.succeed("") // Replace with correct implementation
}
