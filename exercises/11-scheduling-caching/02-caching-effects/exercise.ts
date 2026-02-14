import { Effect, Ref, Option } from "effect"

/**
 * Exercise 1: cachedEffect
 *
 * Create a Ref tracking call count. Use Effect.cached to memoize an effect
 * that increments the Ref and returns its value. Call the cached effect 3
 * times and return all three results as a tuple.
 *
 * Expected: all three values are the same (1, 1, 1)
 */
export const cachedEffect: Effect.Effect<readonly [number, number, number]> = Effect.gen(function* () {
	// TODO: Implement
	return [0, 0, 0] as const
})

/**
 * Exercise 2: uncachedEffect
 *
 * Same as cachedEffect but WITHOUT caching. Call the increment effect 3
 * times and return the results as a tuple.
 *
 * Expected: each call returns a different value (1, 2, 3)
 */
export const uncachedEffect: Effect.Effect<readonly [number, number, number]> = Effect.gen(function* () {
	// TODO: Implement
	return [0, 0, 0] as const
})

/**
 * Exercise 3: cachedOnce
 *
 * Use Effect.once to create an effect that increments a Ref at most once.
 * Call it 3 times, then return the Ref value.
 *
 * Expected: 1 (the effect only runs once)
 */
export const cachedOnce: Effect.Effect<number> = Effect.gen(function* () {
	// TODO: Implement
	return yield* Effect.succeed(0)
})

/**
 * Exercise 4: memoizedFunction
 *
 * Use Effect.cached to memoize an effect that increments a call counter.
 * Call the memoized effect 5 times. Return true if the call count is 1.
 *
 * Expected: true
 */
export const memoizedFunction: Effect.Effect<boolean> = Effect.gen(function* () {
	// TODO: Implement
	return yield* Effect.succeed(false)
})

/**
 * Exercise 5: manualCache
 *
 * Implement manual caching using Ref<Option<number>>. Create a function
 * that on first call computes the value 42 and stores it, and on subsequent
 * calls returns the stored value. Return results of two calls as a tuple.
 *
 * Expected: (42, 42)
 */
export const manualCache: Effect.Effect<readonly [number, number]> = Effect.gen(function* () {
	// TODO: Implement
	return [0, 0] as const
})
