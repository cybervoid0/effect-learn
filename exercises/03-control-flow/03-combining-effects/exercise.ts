import { Effect as E } from "effect"

/**
 * TODO: Combine two Effects into a tuple using Effect.zip
 */
export const zipTwo = <A, B>(
	effectA: E.Effect<A>,
	effectB: E.Effect<B>,
): E.Effect<[A, B]> => {
	// Your code here
	return E.zip(effectA, effectB)
}

/**
 * TODO: Combine two number Effects and sum them using Effect.zipWith
 */
export const zipWithSum = (
	a: E.Effect<number>,
	b: E.Effect<number>,
): E.Effect<number> => {
	// Your code here
	return E.zipWith(a, b, (a, b) => a + b)
}

/**
 * TODO: Combine an array of Effects using Effect.all
 */
export const combineArray = (
	effects: E.Effect<number>[],
): E.Effect<number[]> => {
	// Your code here
	return E.all(effects)
}

/**
 * TODO: Combine an object of Effects using Effect.struct (or Effect.all)
 */
export const combineObject = (effects: {
	name: E.Effect<string>
	age: E.Effect<number>
	active: E.Effect<boolean>
}): E.Effect<{
	name: string
	age: number
	active: boolean
}> => {
	// Your code here
	return E.all(effects)
}

/**
 * TODO: Simulate parallel fetches with concurrency limit
 * Process the array of IDs with concurrency: 3
 * Each ID should be processed with: Effect.succeed(`user-${id}`)
 */
type UserID = `user-${number}`
export const parallelFetch = (ids: number[]): E.Effect<UserID[]> => {
	// Your code here
	return E.forEach(ids, id => E.succeed<UserID>(`user-${id}`), {
		concurrency: 3,
	})
}
