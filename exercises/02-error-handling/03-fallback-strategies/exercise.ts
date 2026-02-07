import { Effect as E, Effect, Schedule } from "effect"
import type * as Cause from "effect/Cause"

/**
 * TODO: Try primary effect, if it fails use fallback effect
 */
export const withFallback = <A, E>(
	primary: E.Effect<A, E>,
	fallback: E.Effect<A, E>,
): E.Effect<A, E> => {
	// Your code here
	return primary.pipe(E.orElse(() => fallback)) // Replace with correct implementation
}

/**
 * TODO: Retry the effect up to 3 times on failure
 */
export const retryThreeTimes = <A, E>(
	effect: E.Effect<A, E>,
): E.Effect<A, E> => {
	// Your code here
	return effect.pipe(E.retry(Schedule.recurs(3))) // Replace with correct implementation
}

/**
 * TODO: Add a 1 second timeout to the effect
 */
export const withTimeout = <A, E>(
	effect: E.Effect<A, E>,
): E.Effect<A, E | Cause.TimeoutException> => {
	// Your code here
	return effect.pipe(Effect.timeout("1 second")) // Replace with correct implementation
}

/**
 * TODO: Retry with exponential backoff
 * Start with 100ms delay, exponentially increase
 * Maximum 5 retries
 */
export const retryWithExponentialBackoff = <A, E>(
	effect: E.Effect<A, E>,
): E.Effect<A, E> => {
	// Your code here
	return effect.pipe(
		E.retry(
			Schedule.exponential("100 millis").pipe(
				Schedule.compose(Schedule.recurs(5)),
			),
		),
	) // Replace with correct implementation
}

/**
 * TODO: Robust operation combining multiple strategies
 * 1. Retry up to 3 times
 * 2. Timeout after 5 seconds
 * 3. If still fails, use fallback value
 */
export const robustOperation = <A>(
	operation: E.Effect<A, string>,
	fallbackValue: A,
): E.Effect<A, never> => {
	// Your code here
	return operation.pipe(
		E.retry(Schedule.recurs(3)),
		E.timeout("5 seconds"),
		E.orElse(() => E.succeed(fallbackValue)),
	)
}
