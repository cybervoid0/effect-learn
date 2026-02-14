import { Effect, Fiber, SynchronizedRef } from "effect"

/**
 * Create a SynchronizedRef initialized to "initial", get and return
 */
export const createSyncRef: Effect.Effect<string> = Effect.gen(function* () {
	const ref = yield* SynchronizedRef.make("initial")
	return yield* SynchronizedRef.get(ref)
})

/**
 * Create a SynchronizedRef(0), updateEffect to add 10, return result
 */
export const effectfulUpdate: Effect.Effect<number> = Effect.gen(function* () {
	const ref = yield* SynchronizedRef.make(0)
	yield* SynchronizedRef.updateEffect(ref, (n) => Effect.succeed(n + 10))
	return yield* SynchronizedRef.get(ref)
})

/**
 * Create a SynchronizedRef("hello"), modifyEffect to return length and append " world"
 */
export const effectfulModify: Effect.Effect<number> = Effect.gen(function* () {
	const ref = yield* SynchronizedRef.make("hello")
	return yield* SynchronizedRef.modifyEffect(ref, (s) =>
		Effect.succeed([s.length, s + " world"] as const),
	)
})

/**
 * Given a SynchronizedRef<number>, increment by 1 and return new value
 */
export const safeIncrement = (
	ref: SynchronizedRef.SynchronizedRef<number>,
): Effect.Effect<number> => {
	return Effect.gen(function* () {
		yield* SynchronizedRef.updateEffect(ref, (n) => Effect.succeed(n + 1))
		return yield* SynchronizedRef.get(ref)
	})
}

/**
 * Create SynchronizedRef(0), fork 10 fibers each incrementing by 1, return final
 */
export const concurrentUpdates: Effect.Effect<number> = Effect.gen(function* () {
	const ref = yield* SynchronizedRef.make(0)
	const fibers = yield* Effect.forEach(
		Array.from({ length: 10 }, (_, i) => i),
		() =>
			Effect.fork(
				SynchronizedRef.updateEffect(ref, (n) => Effect.succeed(n + 1)),
			),
	)
	yield* Effect.forEach(fibers, (fiber) => Fiber.join(fiber), {
		discard: true,
	})
	return yield* SynchronizedRef.get(ref)
})
