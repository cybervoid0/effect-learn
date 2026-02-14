import { Chunk, Effect, Fiber, Queue, Ref } from "effect"

/**
 * Create bounded(10), offer "hello", take and return
 */
export const offerAndTake: Effect.Effect<string> = Effect.gen(function* () {
	const queue = yield* Queue.bounded<string>(10)
	yield* Queue.offer(queue, "hello")
	return yield* Queue.take(queue)
})

/**
 * Create unbounded, offer 1,2,3, takeAll, convert to array
 */
export const multipleItems: Effect.Effect<readonly number[]> = Effect.gen(function* () {
	const queue = yield* Queue.unbounded<number>()
	yield* Queue.offer(queue, 1)
	yield* Queue.offer(queue, 2)
	yield* Queue.offer(queue, 3)
	const chunk = yield* Queue.takeAll(queue)
	return Chunk.toArray(chunk)
})

/**
 * Create bounded(5), offer 3 items, return size
 */
export const queueSize: Effect.Effect<number> = Effect.gen(function* () {
	const queue = yield* Queue.bounded<string>(5)
	yield* Queue.offer(queue, "a")
	yield* Queue.offer(queue, "b")
	yield* Queue.offer(queue, "c")
	return yield* Queue.size(queue)
})

/**
 * Fork producer offering 1-5, fork consumer taking 5 and summing
 */
export const producerConsumer: Effect.Effect<number> = Effect.gen(function* () {
	const queue = yield* Queue.bounded<number>(10)

	yield* Effect.fork(
		Effect.forEach(
			[1, 2, 3, 4, 5],
			(n) => Queue.offer(queue, n),
			{ discard: true },
		),
	)

	const consumer = yield* Effect.fork(
		Effect.gen(function* () {
			const sum = yield* Ref.make(0)
			yield* Effect.forEach(
				Array.from({ length: 5 }, (_, i) => i),
				() =>
					Effect.gen(function* () {
						const item = yield* Queue.take(queue)
						yield* Ref.update(sum, (s) => s + item)
					}),
				{ discard: true },
			)
			return yield* Ref.get(sum)
		}),
	)

	return yield* Fiber.join(consumer)
})

/**
 * Bounded(2), offer 2, fork offer 3rd, take all 3
 */
export const boundedBackpressure: Effect.Effect<readonly [number, number, number]> = Effect.gen(function* () {
	const queue = yield* Queue.bounded<number>(2)
	yield* Queue.offer(queue, 1)
	yield* Queue.offer(queue, 2)

	yield* Effect.fork(Queue.offer(queue, 3))

	const first = yield* Queue.take(queue)
	const second = yield* Queue.take(queue)
	const third = yield* Queue.take(queue)

	return [first, second, third] as const
})
