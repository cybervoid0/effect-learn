import { Array as A, Chunk, Effect, Number as N, PubSub, Queue } from "effect"

/**
 * TODO: Create a bounded PubSub<string> with capacity 10.
 * Subscribe to it, publish "hello", take from the subscription queue.
 * Return the received message.
 *
 * Hint: PubSub.subscribe is scoped — wrap everything in Effect.scoped.
 * Subscribe BEFORE publishing, otherwise the message is lost.
 */
const capacity = 10
export const publishAndReceive: Effect.Effect<string> = Effect.scoped(
	Effect.gen(function* () {
		const pubSub = yield* PubSub.bounded<string>(capacity)
		const queue = yield* PubSub.subscribe(pubSub)
		yield* PubSub.publish(pubSub, "hello")
		return yield* Queue.take(queue)
	}),
)

/**
 * TODO: Create a bounded PubSub<string> with capacity 10.
 * Create 2 subscribers, then publish "msg" once.
 * Both subscribers should receive the same message.
 * Return [sub1msg, sub2msg].
 *
 * Hint: Both subscriptions must be active before publishing.
 */
export const multipleSubscribers: Effect.Effect<readonly [string, string]> =
	Effect.scoped(
		Effect.gen(function* () {
			const pubSub = yield* PubSub.bounded<string>(capacity)
			const subscriber1 = yield* PubSub.subscribe(pubSub)
			const subscriber2 = yield* PubSub.subscribe(pubSub)
			yield* PubSub.publish(pubSub, "msg")
			const subMsg1 = yield* Queue.take(subscriber1)
			const subMsg2 = yield* Queue.take(subscriber2)
			return [subMsg1, subMsg2]
		}),
	)

/**
 * TODO: Create a bounded PubSub<number> with capacity 10.
 * Subscribe, then publish numbers 1, 2, 3 individually.
 * Take 3 items from the subscription and return as an array.
 * Expected: [1, 2, 3]
 *
 * Hint: Use Queue.take for each item, or a loop.
 */
export const publishMany: Effect.Effect<readonly number[]> = Effect.scoped(
	Effect.gen(function* () {
		const pubSub = yield* PubSub.bounded<number>(capacity)
		const subscriber1 = yield* PubSub.subscribe(pubSub)
		const range = A.range(1, 3)
		yield* Effect.forEach(range, n => PubSub.publish(pubSub, n))
		return yield* Effect.forEach(range, () => Queue.take(subscriber1))
	}),
)

/**
 * TODO: Create a bounded PubSub<string> with capacity 10.
 * Create 3 subscribers. Publish "broadcast" once.
 * Each subscriber takes one message.
 * Return the count of subscribers that received "broadcast".
 * Expected: 3
 *
 * Hint: Collect messages from all subscribers, then count.
 */
export const fanOut: Effect.Effect<number> = Effect.scoped(
	Effect.gen(function* () {
		const pubSub = yield* PubSub.bounded<string>(capacity)
		const subscribers = yield* Effect.forEach(A.range(1, 3), () =>
			PubSub.subscribe(pubSub),
		)
		yield* PubSub.publish(pubSub, "broadcast")
		const chunks = yield* Effect.forEach(subscribers, Queue.takeAll)
		return chunks.reduce((acc, ch) => acc + Chunk.size(ch), 0)
	}),
)

/**
 * TODO: Create a bounded PubSub<number> with capacity 10.
 * Subscribe first, then fork a publisher that publishes 1 through 5.
 * The consumer takes 5 items and returns their sum.
 * Expected: 15
 *
 * Hint: Subscribe BEFORE forking the publisher to avoid losing messages.
 * The consumer should take items in a loop (or use Effect.forEach).
 */
export const pubsubWithProcessing: Effect.Effect<number> = Effect.scoped(
	Effect.gen(function* () {
		const pubSub = yield* PubSub.bounded<number>(capacity)
		const queue = yield* PubSub.subscribe(pubSub)
		yield* Effect.fork(PubSub.publishAll(pubSub, A.range(1, 5)))
		return yield* Effect.forEach(A.range(1, 5), () => Queue.take(queue), {
			concurrency: "unbounded",
		}).pipe(Effect.map(N.sumAll))
	}),
)
