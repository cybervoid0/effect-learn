import { Array as A, Chunk, Effect as E, Fiber, Queue } from "effect"

/**
 * TODO: Create a bounded queue with capacity 10.
 * Offer "hello", then take and return it.
 *
 * Hint: Queue.bounded<string>(10), Queue.offer, Queue.take.
 */
export const offerAndTake: E.Effect<string> = E.gen(function* () {
	const q = yield* Queue.bounded<string>(10)
	yield* Queue.offer(q, "hello")
	return yield* Queue.take(q)
})

/**
 * TODO: Create an unbounded queue.
 * Offer 1, 2, 3. Then takeAll and convert the Chunk to an array.
 * Return the array.
 *
 * Hint: Queue.unbounded<number>(), Queue.offer for each, Queue.takeAll, Chunk.toArray.
 */
export const multipleItems: E.Effect<readonly number[]> =
	Queue.unbounded<number>().pipe(
		E.tap(Queue.offerAll([1, 2, 3])),
		E.flatMap(Queue.takeAll),
		E.map(Chunk.toArray),
	)

/**
 * TODO: Create a bounded queue with capacity 5.
 * Offer 3 items (e.g. "a", "b", "c").
 * Return the queue size.
 *
 * Hint: Queue.size returns Effect<number>.
 */
export const queueSize: E.Effect<number> = Queue.bounded<string>(5).pipe(
	E.tap(Queue.offerAll(["a", "b", "c"])),
	E.flatMap(Queue.size),
)

/**
 * TODO: Create a bounded queue.
 * Fork a producer that offers numbers 1 through 5.
 * Fork a consumer that takes 5 items and sums them.
 * Join the consumer and return the sum.
 *
 * Hint: The consumer should take items one at a time in a loop.
 */
export const producerConsumer: E.Effect<number> = Queue.bounded<number>(5).pipe(
	E.tap(q => E.fork(Queue.offerAll(q, A.range(1, 5)))),
	E.andThen(q =>
		E.fork(
			E.iterate(
				{ count: 0, sum: 0 },
				{
					while: ({ count }) => count < 5,
					body: ({ count, sum }) =>
						Queue.take(q).pipe(
							E.andThen(n => ({ count: count + 1, sum: sum + n })),
						),
				},
			).pipe(E.map(({ sum }) => sum)),
		),
	),
	E.andThen(Fiber.join),
)

/**
 * TODO: Create a bounded queue with capacity 2.
 * Offer 2 items (1 and 2) which fills the queue.
 * Fork an offer of a 3rd item (3) -- this will block due to backpressure.
 * Take item 1, then take item 2, then take item 3 (unblocks the forked offer).
 * Return all three items as [first, second, third].
 *
 * Hint: The 3rd offer blocks until you take from the queue.
 */
export const boundedBackpressure: E.Effect<readonly [number, number, number]> =
	E.gen(function* () {
		const q = yield* Queue.bounded<number>(2)
		yield* Queue.offerAll(q, [1, 2])
		yield* E.fork(Queue.offer(q, 3))
		//yield* Queue.offer(q, 3)
		const [item1, item2] = yield* Queue.takeAll(q)
		const item3 = yield* Queue.take(q)
		return [item1, item2, item3]
	})
