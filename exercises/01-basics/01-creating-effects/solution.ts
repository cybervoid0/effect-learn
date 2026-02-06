import { Effect } from "effect"

/**
 * Create an Effect that succeeds with the number 42
 */
export const createSuccessEffect = (): Effect.Effect<number> => {
	return Effect.succeed(42)
}

/**
 * Create an Effect that fails with the error "Something went wrong"
 */
export const createFailureEffect = (): Effect.Effect<never, string> => {
	return Effect.fail("Something went wrong")
}

/**
 * Create an Effect that returns a random number between 0 and 100
 */
export const createRandomEffect = (): Effect.Effect<number> => {
	return Effect.sync(() => Math.floor(Math.random() * 101))
}

/**
 * Create an Effect that returns the current date as an ISO string
 */
export const createDateEffect = (): Effect.Effect<string> => {
	return Effect.sync(() => new Date().toISOString())
}

/**
 * Create an Effect that divides two numbers
 * Fails with "Division by zero" if b is 0
 */
export const createDivisionEffect = (
	a: number,
	b: number,
): Effect.Effect<number, string> => {
	return b === 0
		? Effect.fail("Division by zero")
		: Effect.succeed(a / b)
}
