import { Effect, Option } from "effect"

/**
 * Return "positive" if n > 0, otherwise "non-positive"
 */
export const conditionalEffect = (n: number): Effect.Effect<string> => {
	return n > 0 ? Effect.succeed("positive") : Effect.succeed("non-positive")
}

/**
 * Log the message only if condition is true
 */
export const logIfTrue = (
	condition: boolean,
	message: string,
): Effect.Effect<Option.Option<void>> => {
	return condition
		? Effect.log(message).pipe(Effect.map(() => Option.some(undefined)))
		: Effect.succeed(Option.none())
}

/**
 * Fail with the error message if condition is false
 */
export const failUnless = (
	condition: boolean,
	errorMessage: string,
): Effect.Effect<void, string> => {
	return condition ? Effect.void : Effect.fail(errorMessage)
}

/**
 * Filter positive numbers or fail
 */
export const filterPositive = (n: number): Effect.Effect<number, string> => {
	return Effect.succeed(n).pipe(
		Effect.filterOrFail(
			(num) => num > 0,
			() => "Number must be positive",
		),
	)
}

/**
 * Complex conditional logic
 */
export const complexConditional = (
	n: number,
): Effect.Effect<string, string> => {
	if (n < 0) {
		return Effect.fail("negative")
	}
	if (n === 0) {
		return Effect.succeed("zero")
	}
	if (n < 10) {
		return Effect.succeed("small")
	}
	if (n < 100) {
		return Effect.succeed("medium")
	}
	return Effect.succeed("large")
}
