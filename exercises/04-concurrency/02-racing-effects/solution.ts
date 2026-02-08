import { Duration, Effect } from "effect"

/**
 * Race two effects, return the faster one's result
 */
export const raceTwo = <A>(
	first: Effect.Effect<A>,
	second: Effect.Effect<A>,
): Effect.Effect<A> => {
	return Effect.race(first, second)
}

/**
 * Race a fast-but-failing effect against a slow-but-safe one.
 * Effect.race waits for the first success, so the safe one wins.
 */
export const raceWithFallback = (
	fastDelay: number,
	slowDelay: number,
	safeValue: string,
): Effect.Effect<string> => {
	const fastButFailing = Effect.sleep(Duration.millis(fastDelay)).pipe(
		Effect.andThen(Effect.fail("fast failed" as const)),
	)

	const slowButSafe = Effect.sleep(Duration.millis(slowDelay)).pipe(
		Effect.andThen(Effect.succeed(safeValue)),
	)

	return Effect.race(fastButFailing, slowButSafe)
}

/**
 * Race all effects, return the first result
 */
export const raceAll = <A>(
	effects: ReadonlyArray<Effect.Effect<A>>,
): Effect.Effect<A> => {
	return Effect.raceAll(effects)
}

/**
 * Try effects sequentially until one succeeds
 */
export const firstSuccessful = <A, E>(
	effects: ReadonlyArray<Effect.Effect<A, E>>,
): Effect.Effect<A, E> => {
	return Effect.firstSuccessOf(effects)
}

/**
 * Add a timeout with fallback value
 */
export const withTimeout = <A>(
	effect: Effect.Effect<A>,
	duration: string,
	fallbackValue: A,
): Effect.Effect<A> => {
	return effect.pipe(
		Effect.timeout(duration),
		Effect.catchTag("TimeoutException", () => Effect.succeed(fallbackValue)),
	)
}
