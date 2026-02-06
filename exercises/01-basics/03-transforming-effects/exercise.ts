import { Effect } from "effect"

/**
 * TODO: Double the value of an Effect
 */
export const doubleValue = (effect: Effect.Effect<number>): Effect.Effect<number> => {
	// Your code here
	return effect // Replace with correct implementation
}

/**
 * TODO: Chain two Effects together
 * First effect returns a number, second effect doubles it
 */
export const chainEffects = (
	first: Effect.Effect<number>,
	double: (n: number) => Effect.Effect<number>
): Effect.Effect<number> => {
	// Your code here
	return first // Replace with correct implementation
}

/**
 * TODO: Transform a number Effect to a string Effect
 */
export const transformToString = (effect: Effect.Effect<number>): Effect.Effect<string> => {
	// Your code here
	return Effect.succeed("") // Replace with correct implementation
}

/**
 * TODO: Log the value and return it unchanged
 */
export const logAndReturn = <A>(effect: Effect.Effect<A>): Effect.Effect<A> => {
	// Your code here
	return effect // Replace with correct implementation
}

/**
 * TODO: Complex composition
 * 1. Take the input number
 * 2. Add 10
 * 3. Multiply by 2
 * 4. Convert to string with "Result: " prefix
 */
export const calculateTotal = (n: number): Effect.Effect<string> => {
	// Your code here
	return Effect.succeed("") // Replace with correct implementation
}
