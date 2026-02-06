import { Effect } from "effect"

/**
 * TODO: Combine two Effects into a tuple using Effect.zip
 */
export const zipTwo = <A, B>(
	effectA: Effect.Effect<A>,
	effectB: Effect.Effect<B>,
): Effect.Effect<[A, B]> => {
	// Your code here
	return Effect.succeed([undefined as A, undefined as B]) // Replace
}

/**
 * TODO: Combine two number Effects and sum them using Effect.zipWith
 */
export const zipWithSum = (
	a: Effect.Effect<number>,
	b: Effect.Effect<number>,
): Effect.Effect<number> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Combine an array of Effects using Effect.all
 */
export const combineArray = (
	effects: Effect.Effect<number>[],
): Effect.Effect<number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Combine an object of Effects using Effect.struct (or Effect.all)
 */
export const combineObject = (effects: {
	name: Effect.Effect<string>
	age: Effect.Effect<number>
	active: Effect.Effect<boolean>
}): Effect.Effect<{
	name: string
	age: number
	active: boolean
}> => {
	// Your code here
	return Effect.succeed({ name: "", age: 0, active: false }) // Replace
}

/**
 * TODO: Simulate parallel fetches with concurrency limit
 * Process the array of IDs with concurrency: 3
 * Each ID should be processed with: Effect.succeed(`user-${id}`)
 */
export const parallelFetch = (
	ids: number[],
): Effect.Effect<string[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}
