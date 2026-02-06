import { Effect } from "effect"

/**
 * Combine two Effects into a tuple using Effect.zip
 */
export const zipTwo = <A, B>(
	effectA: Effect.Effect<A>,
	effectB: Effect.Effect<B>,
): Effect.Effect<[A, B]> => {
	return Effect.zip(effectA, effectB)
}

/**
 * Combine two number Effects and sum them using Effect.zipWith
 */
export const zipWithSum = (
	a: Effect.Effect<number>,
	b: Effect.Effect<number>,
): Effect.Effect<number> => {
	return Effect.zipWith(a, b, (x, y) => x + y)
}

/**
 * Combine an array of Effects using Effect.all
 */
export const combineArray = (
	effects: Effect.Effect<number>[],
): Effect.Effect<number[]> => {
	return Effect.all(effects)
}

/**
 * Combine an object of Effects using Effect.all
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
	return Effect.all(effects)
}

/**
 * Simulate parallel fetches with concurrency limit
 */
export const parallelFetch = (ids: number[]): Effect.Effect<string[]> => {
	return Effect.all(
		ids.map((id) => Effect.succeed(`user-${id}`)),
		{ concurrency: 3 },
	)
}
