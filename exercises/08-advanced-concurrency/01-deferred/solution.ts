import { Deferred, Effect, Fiber } from "effect"

/**
 * Create a Deferred, succeed with "hello", await and return
 */
export const createAndComplete: Effect.Effect<string> = Effect.gen(function* () {
	const deferred = yield* Deferred.make<string, never>()
	yield* Deferred.succeed(deferred, "hello")
	return yield* Deferred.await(deferred)
})

/**
 * Create a Deferred, fail with "error", await + catchAll
 */
export const deferredWithFailure: Effect.Effect<string> = Effect.gen(function* () {
	const deferred = yield* Deferred.make<string, string>()
	yield* Deferred.fail(deferred, "error")
	return yield* Deferred.await(deferred).pipe(
		Effect.catchAll((err) => Effect.succeed(err)),
	)
})

/**
 * Fork fiber awaiting Deferred, succeed 42, join
 */
export const waitForSignal: Effect.Effect<number> = Effect.gen(function* () {
	const deferred = yield* Deferred.make<number, never>()
	const fiber = yield* Effect.fork(Deferred.await(deferred))
	yield* Deferred.succeed(deferred, 42)
	return yield* Fiber.join(fiber)
})

/**
 * Check isDone before and after completion
 */
export const isDoneCheck: Effect.Effect<readonly [boolean, boolean]> = Effect.gen(function* () {
	const deferred = yield* Deferred.make<void, never>()
	const before = yield* Deferred.isDone(deferred)
	yield* Deferred.succeed(deferred, void 0)
	const after = yield* Deferred.isDone(deferred)
	return [before, after] as const
})

/**
 * Handshake: two fibers exchange messages via two Deferreds
 */
export const handshake: Effect.Effect<readonly [string, string]> = Effect.gen(function* () {
	const d1 = yield* Deferred.make<string, never>()
	const d2 = yield* Deferred.make<string, never>()

	const fiber1 = yield* Effect.fork(
		Effect.gen(function* () {
			yield* Deferred.succeed(d1, "ping")
			return yield* Deferred.await(d2)
		}),
	)

	const fiber2 = yield* Effect.fork(
		Effect.gen(function* () {
			const value = yield* Deferred.await(d1)
			yield* Deferred.succeed(d2, "pong")
			return value
		}),
	)

	const f1result = yield* Fiber.join(fiber1)
	const f2result = yield* Fiber.join(fiber2)
	return [f1result, f2result] as const
})
