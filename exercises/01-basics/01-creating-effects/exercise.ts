import { Effect } from "effect"

/**
 * TODO: Create an Effect that succeeds with the number 42
 */
export const createSuccessEffect = (): Effect.Effect<number> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Create an Effect that fails with the error "Something went wrong"
 */
export const createFailureEffect = (): Effect.Effect<never, string> => {
	// Your code here
	return Effect.fail("") // Replace with correct implementation
}

/**
 * TODO: Create an Effect that returns a random number between 0 and 100
 */
export const createRandomEffect = (): Effect.Effect<number> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Create an Effect that returns the current date as an ISO string
 */
export const createDateEffect = (): Effect.Effect<string> => {
	// Your code here
	return Effect.succeed("") // Replace with correct implementation
}

/**
 * TODO: Create an Effect that divides two numbers
 * Should fail with "Division by zero" if b is 0
 */
export const createDivisionEffect = (
	a: number,
	b: number,
): Effect.Effect<number, string> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}
