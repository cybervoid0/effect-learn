import { type Duration, Effect } from "effect"

/**
 * TODO: Race two effects and return the result of the faster one.
 * Use Effect.race.
 */
export const raceTwo = <A>(
	first: Effect.Effect<A>,
	second: Effect.Effect<A>,
): Effect.Effect<A> => {
	// Your code here
	return Effect.race(first, second)
}

/**
 * TODO: Race a fast-but-failing effect against a slow-but-safe one.
 * The fast effect fails after `fastDelay` ms.
 * The slow effect succeeds with `safeValue` after `slowDelay` ms.
 *
 * Use Effect.race — the safe effect should win because
 * Effect.race waits for the first SUCCESS, not the first settlement.
 */
export const raceWithFallback = (
	fastDelay: number,
	slowDelay: number,
	safeValue: string,
): Effect.Effect<string, string> => {
	// Your code here
	return Effect.race(
		Effect.fail("fast failed").pipe(Effect.delay(fastDelay)),
		Effect.succeed(safeValue).pipe(Effect.delay(slowDelay)),
	)
}

/**
 * TODO: Race all effects in the array and return the first result.
 * Use Effect.raceAll.
 */
export const raceAll = <A>(
	effects: ReadonlyArray<Effect.Effect<A>>,
): Effect.Effect<A> => {
	// Your code here
	return Effect.raceAll(effects)
}

/**
 * TODO: Try effects one by one until one succeeds.
 * If all fail, return the last error.
 * Use Effect.firstSuccessOf.
 *
 * Note: this is sequential, not concurrent!
 */
export const firstSuccessful = <A, E>(
	effects: ReadonlyArray<Effect.Effect<A, E>>,
): Effect.Effect<A, E> => {
	// Your code here
	return Effect.firstSuccessOf(effects)
}

/**
 * TODO: Add a timeout to the given effect.
 * If the effect completes in time, return its result.
 * If it times out, return the provided `fallbackValue`.
 *
 * Hint: use Effect.timeout + Effect.catchTag("TimeoutException", ...)
 */
export const withTimeout = <A>(
	effect: Effect.Effect<A>,
	duration: Duration.DurationInput,
	fallbackValue: A,
): Effect.Effect<A> => {
	// Your code here
	return effect.pipe(
		Effect.timeout(duration),
		Effect.catchTag("TimeoutException", () => Effect.succeed(fallbackValue)),
	)
}
