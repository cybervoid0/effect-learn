import { Effect, Fiber, SynchronizedRef } from "effect"

/**
 * TODO: Create a SynchronizedRef initialized to "initial",
 * then get and return the value.
 *
 * Hint: SynchronizedRef.make works like Ref.make, SynchronizedRef.get reads the value.
 */
export const createSyncRef: Effect.Effect<string> = SynchronizedRef.make(
	"initial",
).pipe(Effect.flatMap(SynchronizedRef.get))

/**
 * TODO: Create a SynchronizedRef initialized to 0.
 * Use SynchronizedRef.updateEffect to add 10.
 * Return the new value.
 *
 * Hint: updateEffect takes a function returning an Effect of the new value.
 */
export const effectfulUpdate: Effect.Effect<number> = SynchronizedRef.make(
	0,
).pipe(
	Effect.tap(SynchronizedRef.updateEffect(a => Effect.succeed(a + 10))),
	Effect.flatMap(SynchronizedRef.get),
)

/**
 * TODO: Create a SynchronizedRef initialized to "hello".
 * Use SynchronizedRef.modifyEffect to return the string's length
 * while changing the stored value to "hello world".
 *
 * Hint: modifyEffect takes a function returning Effect<[returnValue, newState]>.
 */
export const effectfulModify: Effect.Effect<number> = Effect.gen(function* () {
	const ref = yield* SynchronizedRef.make("hello")
	return yield* SynchronizedRef.modifyEffect(ref, a =>
		Effect.succeed([a.length, `${a} world`]),
	)
})

/**
 * TODO: Given a SynchronizedRef<number>, use updateEffect to increment by 1.
 * Return the new value after incrementing.
 *
 * Hint: Use SynchronizedRef.updateEffect then SynchronizedRef.get.
 */
export const safeIncrement = (
	ref: SynchronizedRef.SynchronizedRef<number>,
): Effect.Effect<number> =>
	SynchronizedRef.updateEffect(ref, a => Effect.succeed(a + 1)).pipe(
		Effect.andThen(SynchronizedRef.get(ref)),
	)

/**
 * TODO: Create a SynchronizedRef initialized to 0.
 * Fork 10 fibers, each incrementing the ref by 1 using updateEffect.
 * Join all fibers, then return the final value.
 *
 * Hint: Use Effect.fork + Fiber.join, or Effect.all with concurrency.
 */
export const concurrentUpdates: Effect.Effect<number> = Effect.gen(
	function* () {
		const ref = yield* SynchronizedRef.make(0)
		const fibers = yield* Effect.forEach(
			Array.from({ length: 10 }),
			() =>
				Effect.fork(
					SynchronizedRef.updateEffect(ref, a => Effect.succeed(a + 1)),
				),
			{ concurrency: "unbounded" },
		)
		yield* Effect.forEach(fibers, Fiber.join, { concurrency: "unbounded" })
		return yield* SynchronizedRef.get(ref)
	},
)
