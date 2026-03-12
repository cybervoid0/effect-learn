import {
	Array as A,
	Chunk,
	Deferred,
	Effect,
	Equal,
	Fiber,
	Stream,
	SubscriptionRef,
} from "effect"

/**
 * TODO: Create a SubscriptionRef initialized to 0,
 * get the initial value, and return it.
 *
 * Hint: SubscriptionRef.make, SubscriptionRef.get work like Ref.
 */
export const createSubRef: Effect.Effect<number> = SubscriptionRef.make(0).pipe(
	Effect.andThen(SubscriptionRef.get),
)

/**
 * TODO: Create a SubscriptionRef initialized to "start",
 * set it to "end", then get and return the value.
 *
 * Hint: Use SubscriptionRef.set to update, SubscriptionRef.get to read.
 */
export const updateAndRead: Effect.Effect<string> = SubscriptionRef.make(
	"start",
).pipe(
	Effect.tap(SubscriptionRef.set("end")),
	Effect.andThen(SubscriptionRef.get),
)

/**
 * TODO: Create a SubscriptionRef initialized to 0.
 * Fork a subscriber that takes 3 values from ref.changes.
 * Then set the ref to 1, 2, 3 in sequence.
 * Join the subscriber and return the collected values as a number[].
 *
 * Hint: Use Stream.take(3), Stream.runCollect, Chunk.toArray.
 * The subscriber sees the current value (0) plus updates.
 */
export const collectChanges: Effect.Effect<number[]> = Effect.gen(function* () {
	const ref = yield* SubscriptionRef.make(0)
	const gate = yield* Deferred.make<void>()
	const fiber = yield* Effect.fork(
		ref.changes.pipe(
			Stream.tap(() => Deferred.succeed(gate, undefined)),
			Stream.take(3),
			Stream.runCollect,
			Effect.map(Chunk.toArray),
		),
	)
	yield* Deferred.await(gate)
	yield* Effect.forEach([...Array(3).keys()], i =>
		SubscriptionRef.set(ref, i + 1),
	)

	return yield* Fiber.join(fiber)
})

/**
 * TODO: Create a SubscriptionRef initialized to 0.
 * Create 2 subscribers, each taking 2 values from ref.changes.
 * Set the ref to 1, then 2.
 * Join both subscribers and check they received the same values.
 * Return true if both received identical arrays.
 *
 * Hint: Fork both subscribers before setting values.
 */
export const multipleSubscribers: Effect.Effect<boolean> = Effect.gen(
	function* () {
		const ref = yield* SubscriptionRef.make(0)
		const defs = yield* Effect.forEach(A.range(1, 3), () =>
			Deferred.make<void>(),
		)

		const fibers = yield* Effect.forEach(defs, def =>
			Effect.fork(
				ref.changes.pipe(
					Stream.tap(() => Deferred.succeed(def, undefined)),
					Stream.take(2),
					Stream.runCollect,
				),
			),
		)

		// waiting for all subscribers to finish with subscription
		yield* Effect.forEach(defs, Deferred.await)

		yield* SubscriptionRef.set(ref, 1)
		yield* SubscriptionRef.set(ref, 2)

		const [first, ...chunks] = yield* Effect.forEach(fibers, Fiber.join)

		return chunks.every(ch => Equal.equals(first, ch))
	},
)

/**
 * TODO: Create a SubscriptionRef initialized to "a".
 * Fork a subscriber that takes 4 values from ref.changes.
 * Set the ref to "b", "c", "d" in sequence.
 * Join the subscriber and return the collected values as a string[].
 *
 * Hint: The subscriber will see "a" (initial), "b", "c", "d".
 */
export const trackHistory: Effect.Effect<string[]> = Effect.gen(function* () {
	// create a Ref
	const ref = yield* SubscriptionRef.make("a")
	const gate = yield* Deferred.make<void>()

	// fork subscriber and subscribe to 4 values
	const subscriber = yield* Effect.fork(
		ref.changes.pipe(
			Stream.tap(() => Deferred.succeed(gate, undefined)),
			Stream.take(4),
			Stream.runCollect,
			Effect.map(Chunk.toArray),
		),
	)

	yield* Deferred.await(gate)

	// change the Ref 3 times
	yield* SubscriptionRef.set(ref, "b")
	yield* SubscriptionRef.set(ref, "c")
	yield* SubscriptionRef.set(ref, "d")

	// collect the values and return as an array
	return yield* Fiber.join(subscriber)
})
