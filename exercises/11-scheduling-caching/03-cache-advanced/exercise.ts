import { Cache, Effect, Ref } from "effect"

/**
 * Exercise 1: createBasicCache
 *
 * Create a cache with capacity 100, TTL "1 hour", and a lookup function that
 * converts a number key to its string representation. Get key 42 and return it.
 *
 * Expected: "42"
 */
export const createBasicCache: Effect.Effect<string> = Effect.gen(function* () {
	// TODO: Implement
	return yield* Effect.succeed("")
})

/**
 * Exercise 2: cacheLookup
 *
 * Create a cache with a Ref tracking lookup call count. The lookup converts
 * a number to a string. Get the same key (1) twice. Return the value and the
 * call count as a tuple.
 *
 * Expected: ["1", 1] (lookup called only once)
 */
export const cacheLookup: Effect.Effect<readonly [string, number]> = Effect.gen(function* () {
	// TODO: Implement
	return ["", 0] as const
})

/**
 * Exercise 3: cacheMultipleKeys
 *
 * Create a cache and get values for keys 1, 2, and 3.
 * Return all three string values as a tuple.
 *
 * Expected: ["1", "2", "3"]
 */
export const cacheMultipleKeys: Effect.Effect<readonly [string, string, string]> = Effect.gen(function* () {
	// TODO: Implement
	return ["", "", ""] as const
})

/**
 * Exercise 4: cacheCapacity
 *
 * Create a cache with capacity 2 and a Ref tracking lookup calls.
 * Get keys 1, 2, 3 (this evicts key 1). Then get key 1 again
 * (triggers a re-lookup). Return the total lookup count.
 *
 * Expected: 4 (keys 1, 2, 3 each trigger a lookup, then key 1 again)
 */
export const cacheCapacity: Effect.Effect<number> = Effect.gen(function* () {
	// TODO: Implement
	return yield* Effect.succeed(0)
})

/**
 * Exercise 5: cacheWithErrors
 *
 * Create a cache whose lookup fails with "negative key" for negative keys and
 * returns the string representation for positive keys. Get key 1 (succeeds)
 * and key -1 (fails). Return the success value and whether the negative
 * lookup failed.
 *
 * Expected: ["1", true]
 */
export const cacheWithErrors: Effect.Effect<readonly [string, boolean]> = Effect.gen(function* () {
	// TODO: Implement
	return ["", false] as const
})
