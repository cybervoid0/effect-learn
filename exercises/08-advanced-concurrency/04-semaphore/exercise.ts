import { Array as A, Effect, Ref } from "effect"

/**
 * TODO: Create a semaphore with 1 permit.
 * Use withPermits(1) to run Effect.succeed(42).
 * Return the result.
 *
 * Hint: Effect.makeSemaphore(n), sem.withPermits(n)(effect).
 */
export const basicPermit: Effect.Effect<number> = Effect.gen(function* () {
	const mutex = yield* Effect.makeSemaphore(1)
	return yield* mutex.withPermits(1)(Effect.succeed(42))
})

/**
 * TODO: Create a semaphore with 2 permits.
 * Run 5 concurrent tasks. Each task should:
 *   1. Atomically increment a "current" Ref (Ref.updateAndGet)
 *   2. Update a "max" Ref with Math.max(max, current)
 *   3. Sleep for 10 millis
 *   4. Decrement the "current" Ref
 * All tasks must go through sem.withPermits(1).
 * Return the max concurrent count (should be ≤ 2).
 *
 * Hint: Use Effect.forEach with { concurrency: "unbounded" }.
 */
export const limitConcurrency: Effect.Effect<number> = Effect.gen(function* () {
	const current = yield* Ref.make(0)
	const max = yield* Ref.make(0)
	const sem2 = yield* Effect.makeSemaphore(2)
	yield* Effect.forEach(
		A.range(1, 5),
		() =>
			sem2.withPermits(1)(
				Effect.gen(function* () {
					const incrCurr = yield* Ref.updateAndGet(current, n => n + 1)
					yield* Ref.update(max, n => Math.max(n, incrCurr))
					yield* Effect.sleep("10 millis")
					yield* Ref.update(current, n => n - 1)
				}),
			),
		{
			concurrency: "unbounded",
		},
	)
	return yield* Ref.get(max)
})

/**
 * TODO: Create a semaphore with 1 permit (mutex).
 * Create a Ref<number> initialized to 0.
 * Run 10 concurrent fibers, each doing a NON-ATOMIC increment:
 *   1. Read current value from Ref
 *   2. yield* Effect.yieldNow()  (forces context switch)
 *   3. Write (current + 1) to Ref
 * Protect this entire sequence with sem.withPermits(1).
 * Return the final count (should be exactly 10).
 *
 * Without the semaphore, concurrent read-yield-write would lose updates.
 */
export const mutualExclusion: Effect.Effect<number> = Effect.gen(function* () {
	const mutex = yield* Effect.makeSemaphore(1)
	const ref = yield* Ref.make<number>(0)
	yield* Effect.forEach(
		A.range(1, 10),
		() =>
			mutex.withPermits(1)(
				Effect.gen(function* () {
					const curr = yield* Ref.get(ref)
					yield* Effect.yieldNow()
					yield* Ref.set(ref, curr + 1)
				}),
			),
		{ concurrency: "unbounded" },
	)
	return yield* Ref.get(ref)
})

/**
 * TODO: Create a semaphore with 3 permits (simulating a connection pool).
 * Run 10 concurrent tasks. Each task should:
 *   1. Atomically increment a "current" Ref
 *   2. Update a "max" Ref with Math.max(max, current)
 *   3. Sleep for 5 millis
 *   4. Decrement the "current" Ref
 * All tasks must go through sem.withPermits(1).
 * Return the max concurrent count (should be ≤ 3).
 */
export const connectionPool: Effect.Effect<number> = Effect.gen(function* () {
	const current = yield* Ref.make(0)
	const max = yield* Ref.make(0)
	const sem = yield* Effect.makeSemaphore(3)
	yield* Effect.forEach(
		A.range(1, 10),
		() =>
			sem.withPermits(1)(
				Effect.gen(function* () {
					const curr = yield* Ref.updateAndGet(current, x => x + 1)
					yield* Ref.update(max, x => Math.max(curr, x))
					yield* Effect.sleep("5 millis")
					yield* Ref.update(current, x => x - 1)
				}),
			),
		{ concurrency: "unbounded" },
	)
	return yield* Ref.get(max)
})
