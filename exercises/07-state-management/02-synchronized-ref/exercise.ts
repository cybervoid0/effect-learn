import { Effect, SynchronizedRef } from "effect"

/**
 * TODO: Create a SynchronizedRef initialized to "initial",
 * then get and return the value.
 *
 * Hint: SynchronizedRef.make works like Ref.make, SynchronizedRef.get reads the value.
 */
export const createSyncRef: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Create a SynchronizedRef initialized to 0.
 * Use SynchronizedRef.updateEffect to add 10.
 * Return the new value.
 *
 * Hint: updateEffect takes a function returning an Effect of the new value.
 */
export const effectfulUpdate: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a SynchronizedRef initialized to "hello".
 * Use SynchronizedRef.modifyEffect to return the string's length
 * while changing the stored value to "hello world".
 *
 * Hint: modifyEffect takes a function returning Effect<[returnValue, newState]>.
 */
export const effectfulModify: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Given a SynchronizedRef<number>, use updateEffect to increment by 1.
 * Return the new value after incrementing.
 *
 * Hint: Use SynchronizedRef.updateEffect then SynchronizedRef.get.
 */
export const safeIncrement = (
	ref: SynchronizedRef.SynchronizedRef<number>,
): Effect.Effect<number> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}

/**
 * TODO: Create a SynchronizedRef initialized to 0.
 * Fork 10 fibers, each incrementing the ref by 1 using updateEffect.
 * Join all fibers, then return the final value.
 *
 * Hint: Use Effect.fork + Fiber.join, or Effect.all with concurrency.
 */
export const concurrentUpdates: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation
