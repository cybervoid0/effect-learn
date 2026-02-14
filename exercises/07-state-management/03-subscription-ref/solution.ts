import { Chunk, Effect, Fiber, Stream, SubscriptionRef } from "effect"

/**
 * Create a SubscriptionRef(0), get initial value
 */
export const createSubRef: Effect.Effect<number> = Effect.gen(function* () {
	const ref = yield* SubscriptionRef.make(0)
	return yield* SubscriptionRef.get(ref)
})

/**
 * Create a SubscriptionRef("start"), set to "end", get and return
 */
export const updateAndRead: Effect.Effect<string> = Effect.gen(function* () {
	const ref = yield* SubscriptionRef.make("start")
	yield* SubscriptionRef.set(ref, "end")
	return yield* SubscriptionRef.get(ref)
})

/**
 * Create a SubscriptionRef(0), fork subscriber that takes 3, set 1,2,3, join
 */
export const collectChanges: Effect.Effect<number[]> = Effect.gen(function* () {
	const ref = yield* SubscriptionRef.make(0)
	const subscriber = yield* Effect.fork(
		ref.changes.pipe(
			Stream.take(3),
			Stream.runCollect,
			Effect.map(Chunk.toArray),
		),
	)
	yield* SubscriptionRef.set(ref, 1)
	yield* SubscriptionRef.set(ref, 2)
	yield* SubscriptionRef.set(ref, 3)
	return yield* Fiber.join(subscriber)
})

/**
 * Create a SubscriptionRef(0), 2 subscribers each take 2, set 1,2, both get same
 */
export const multipleSubscribers: Effect.Effect<boolean> = Effect.gen(function* () {
	const ref = yield* SubscriptionRef.make(0)
	const sub1 = yield* Effect.fork(
		ref.changes.pipe(
			Stream.take(2),
			Stream.runCollect,
			Effect.map(Chunk.toArray),
		),
	)
	const sub2 = yield* Effect.fork(
		ref.changes.pipe(
			Stream.take(2),
			Stream.runCollect,
			Effect.map(Chunk.toArray),
		),
	)
	yield* SubscriptionRef.set(ref, 1)
	yield* SubscriptionRef.set(ref, 2)
	const values1 = yield* Fiber.join(sub1)
	const values2 = yield* Fiber.join(sub2)
	return JSON.stringify(values1) === JSON.stringify(values2)
})

/**
 * Create a SubscriptionRef("a"), fork subscriber takes 4, set "b","c","d", join
 */
export const trackHistory: Effect.Effect<string[]> = Effect.gen(function* () {
	const ref = yield* SubscriptionRef.make("a")
	const subscriber = yield* Effect.fork(
		ref.changes.pipe(
			Stream.take(4),
			Stream.runCollect,
			Effect.map(Chunk.toArray),
		),
	)
	yield* SubscriptionRef.set(ref, "b")
	yield* SubscriptionRef.set(ref, "c")
	yield* SubscriptionRef.set(ref, "d")
	return yield* Fiber.join(subscriber)
})
