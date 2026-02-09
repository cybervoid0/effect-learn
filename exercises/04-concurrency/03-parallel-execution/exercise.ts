import { Duration, Effect } from "effect"

/**
 * TODO: Run all effects in parallel with unbounded concurrency.
 * Return an array of results.
 */
export const parallelAll = <A>(
	effects: ReadonlyArray<Effect.Effect<A>>,
): Effect.Effect<Array<A>> => {
	// Your code here
	return Effect.all(effects, { concurrency: "unbounded" }) // Replace with correct implementation
}

/**
 * TODO: Run all effects in parallel but limit concurrency to `limit`.
 * Return an array of results.
 */
export const parallelWithLimit = <A>(
	effects: ReadonlyArray<Effect.Effect<A>>,
	limit: number,
): Effect.Effect<Array<A>> => {
	// Your code here
	return Effect.all(effects, { concurrency: limit }) // Replace with correct implementation
}

/**
 * TODO: Process each item in the array by applying `fn` to it,
 * running at most `concurrency` effects at a time.
 * Return an array of results.
 */
export const parallelForEach = <A, B>(
	items: ReadonlyArray<A>,
	fn: (item: A) => Effect.Effect<B>,
	concurrency: number,
): Effect.Effect<Array<B>> => {
	// Your code here
	return Effect.forEach(items, fn, { concurrency })
}

/**
 * TODO: Run all validation effects in parallel.
 * Instead of failing on the first error, collect ALL errors.
 * Use `mode: "validate"`.
 *
 * Return Effect<Array<A>, Array<E>>
 */
export const validateAll = <A, E>(
	effects: ReadonlyArray<Effect.Effect<A, E>>,
) => {
	// Your code here
	return Effect.all(effects, {
		concurrency: "unbounded",
		mode: "validate",
	})
}

/**
 * TODO: Prove that parallel execution is faster than sequential.
 *
 * Given an array of effects (each taking some time),
 * run them both sequentially and in parallel.
 * Return an object { sequential: number; parallel: number }
 * where each number is the execution time in milliseconds.
 *
 * Hint: use Effect.timed + Duration.toMillis
 */
export const measureSpeedup = (
	effects: ReadonlyArray<Effect.Effect<void>>,
): Effect.Effect<{ sequential: number; parallel: number }> =>
	Effect.gen(function* () {
		const [d1] = yield* Effect.timed(Effect.all(effects))
		const [d2] = yield* Effect.timed(
			Effect.all(effects, { concurrency: "unbounded" }),
		)
		const sequential = Duration.toMillis(d1)
		const parallel = Duration.toMillis(d2)
		return {
			sequential,
			parallel,
		}
	})
