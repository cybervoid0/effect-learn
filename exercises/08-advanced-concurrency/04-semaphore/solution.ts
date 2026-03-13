import { Array as A, Effect, Ref } from "effect"

export const basicPermit: Effect.Effect<number> = Effect.gen(function* () {
	const sem = yield* Effect.makeSemaphore(1)
	return yield* sem.withPermits(1)(Effect.succeed(42))
})

export const limitConcurrency: Effect.Effect<number> = Effect.gen(
	function* () {
		const sem = yield* Effect.makeSemaphore(2)
		const current = yield* Ref.make(0)
		const max = yield* Ref.make(0)

		yield* Effect.forEach(
			A.range(1, 5),
			() =>
				sem.withPermits(1)(
					Effect.gen(function* () {
						const c = yield* Ref.updateAndGet(current, (n) => n + 1)
						yield* Ref.update(max, (m) => Math.max(m, c))
						yield* Effect.sleep("10 millis")
						yield* Ref.update(current, (n) => n - 1)
					}),
				),
			{ concurrency: "unbounded" },
		)

		return yield* Ref.get(max)
	},
)

export const mutualExclusion: Effect.Effect<number> = Effect.gen(
	function* () {
		const sem = yield* Effect.makeSemaphore(1)
		const counter = yield* Ref.make(0)

		yield* Effect.forEach(
			A.range(1, 10),
			() =>
				sem.withPermits(1)(
					Effect.gen(function* () {
						const val = yield* Ref.get(counter)
						yield* Effect.yieldNow()
						yield* Ref.set(counter, val + 1)
					}),
				),
			{ concurrency: "unbounded" },
		)

		return yield* Ref.get(counter)
	},
)

export const connectionPool: Effect.Effect<number> = Effect.gen(function* () {
	const sem = yield* Effect.makeSemaphore(3)
	const current = yield* Ref.make(0)
	const max = yield* Ref.make(0)

	yield* Effect.forEach(
		A.range(1, 10),
		() =>
			sem.withPermits(1)(
				Effect.gen(function* () {
					const c = yield* Ref.updateAndGet(current, (n) => n + 1)
					yield* Ref.update(max, (m) => Math.max(m, c))
					yield* Effect.sleep("5 millis")
					yield* Ref.update(current, (n) => n - 1)
				}),
			),
		{ concurrency: "unbounded" },
	)

	return yield* Ref.get(max)
})
