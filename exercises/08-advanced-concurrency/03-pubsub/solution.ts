import { Array as A, Effect, PubSub, Queue } from "effect"

export const publishAndReceive: Effect.Effect<string> = Effect.scoped(
	Effect.gen(function* () {
		const pubsub = yield* PubSub.bounded<string>(10)
		const sub = yield* PubSub.subscribe(pubsub)
		yield* PubSub.publish(pubsub, "hello")
		return yield* Queue.take(sub)
	}),
)

export const multipleSubscribers: Effect.Effect<readonly [string, string]> =
	Effect.scoped(
		Effect.gen(function* () {
			const pubsub = yield* PubSub.bounded<string>(10)
			const sub1 = yield* PubSub.subscribe(pubsub)
			const sub2 = yield* PubSub.subscribe(pubsub)
			yield* PubSub.publish(pubsub, "msg")
			const msg1 = yield* Queue.take(sub1)
			const msg2 = yield* Queue.take(sub2)
			return [msg1, msg2] as const
		}),
	)

export const publishMany: Effect.Effect<readonly number[]> = Effect.scoped(
	Effect.gen(function* () {
		const pubsub = yield* PubSub.bounded<number>(10)
		const sub = yield* PubSub.subscribe(pubsub)
		yield* PubSub.publish(pubsub, 1)
		yield* PubSub.publish(pubsub, 2)
		yield* PubSub.publish(pubsub, 3)
		return yield* Effect.forEach(A.range(1, 3), () => Queue.take(sub))
	}),
)

export const fanOut: Effect.Effect<number> = Effect.scoped(
	Effect.gen(function* () {
		const pubsub = yield* PubSub.bounded<string>(10)
		const sub1 = yield* PubSub.subscribe(pubsub)
		const sub2 = yield* PubSub.subscribe(pubsub)
		const sub3 = yield* PubSub.subscribe(pubsub)
		yield* PubSub.publish(pubsub, "broadcast")
		const msgs = yield* Effect.all([
			Queue.take(sub1),
			Queue.take(sub2),
			Queue.take(sub3),
		])
		return msgs.filter((m) => m === "broadcast").length
	}),
)

export const pubsubWithProcessing: Effect.Effect<number> = Effect.scoped(
	Effect.gen(function* () {
		const pubsub = yield* PubSub.bounded<number>(10)
		const sub = yield* PubSub.subscribe(pubsub)
		yield* Effect.fork(
			Effect.forEach(A.range(1, 5), (n) => PubSub.publish(pubsub, n), {
				discard: true,
			}),
		)
		const items = yield* Effect.forEach(A.range(1, 5), () =>
			Queue.take(sub),
		)
		return items.reduce((acc, n) => acc + n, 0)
	}),
)
