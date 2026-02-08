import { Duration, Effect } from "effect"

/**
 * Run all effects in parallel with unbounded concurrency
 */
export const parallelAll = <A>(
	effects: ReadonlyArray<Effect.Effect<A>>,
): Effect.Effect<Array<A>> => {
	return Effect.all(effects, { concurrency: "unbounded" })
}

/**
 * Run all effects in parallel with a concurrency limit
 */
export const parallelWithLimit = <A>(
	effects: ReadonlyArray<Effect.Effect<A>>,
	limit: number,
): Effect.Effect<Array<A>> => {
	return Effect.all(effects, { concurrency: limit })
}

/**
 * Process each item in parallel with concurrency limit
 */
export const parallelForEach = <A, B>(
	items: ReadonlyArray<A>,
	fn: (item: A) => Effect.Effect<B>,
	concurrency: number,
): Effect.Effect<Array<B>> => {
	return Effect.forEach(items, fn, { concurrency })
}

/**
 * Run all validations in parallel, collect ALL errors
 */
export const validateAll = <A, E>(
	effects: ReadonlyArray<Effect.Effect<A, E>>,
): Effect.Effect<Array<A>, Array<E>> => {
	return Effect.all(effects, {
		concurrency: "unbounded",
		mode: "validate",
	})
}

/**
 * Measure sequential vs parallel execution time
 */
export const measureSpeedup = (
	effects: ReadonlyArray<Effect.Effect<void>>,
): Effect.Effect<{ sequential: number; parallel: number }> => {
	return Effect.gen(function* () {
		// Sequential
		const [seqDuration] = yield* Effect.timed(Effect.all(effects))

		// Parallel
		const [parDuration] = yield* Effect.timed(
			Effect.all(effects, { concurrency: "unbounded" }),
		)

		return {
			sequential: Duration.toMillis(seqDuration),
			parallel: Duration.toMillis(parDuration),
		}
	})
}
