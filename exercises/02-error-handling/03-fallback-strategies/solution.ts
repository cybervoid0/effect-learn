import { Effect, Schedule } from "effect"
import type * as Cause from "effect/Cause"

/**
 * Try primary effect, if it fails use fallback effect
 */
export const withFallback = <A, E>(
	primary: Effect.Effect<A, E>,
	fallback: Effect.Effect<A, E>,
): Effect.Effect<A, E> => {
	return primary.pipe(Effect.orElse(() => fallback))
}

/**
 * Retry the effect up to 3 times on failure
 */
export const retryThreeTimes = <A, E>(
	effect: Effect.Effect<A, E>,
): Effect.Effect<A, E> => {
	return effect.pipe(Effect.retry(Schedule.recurs(3)))
}

/**
 * Add a 1 second timeout to the effect
 */
export const withTimeout = <A, E>(
	effect: Effect.Effect<A, E>,
): Effect.Effect<A, E | Cause.TimeoutException> => {
	return effect.pipe(Effect.timeout("1 second"))
}

/**
 * Retry with exponential backoff
 */
export const retryWithExponentialBackoff = <A, E>(
	effect: Effect.Effect<A, E>,
): Effect.Effect<A, E> => {
	return effect.pipe(
		Effect.retry(
			Schedule.exponential("100 millis").pipe(
				Schedule.compose(Schedule.recurs(5)),
			),
		),
	)
}

/**
 * Robust operation combining multiple strategies
 */
export const robustOperation = <A>(
	operation: Effect.Effect<A, string>,
	fallbackValue: A,
): Effect.Effect<A, never> => {
	return operation.pipe(
		Effect.retry(Schedule.recurs(3)),
		Effect.timeout("5 seconds"),
		Effect.catchAll(() => Effect.succeed(fallbackValue)),
	)
}
