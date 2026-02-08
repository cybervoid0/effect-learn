import { Effect, Exit, Fiber, FiberStatus } from "effect"

/**
 * Fork an effect and join it to retrieve the result
 */
export const forkAndJoin = <A, E>(
	effect: Effect.Effect<A, E>,
): Effect.Effect<A, E> => {
	return Effect.gen(function* () {
		const fiber = yield* Effect.fork(effect)
		return yield* Fiber.join(fiber)
	})
}

/**
 * Fork an effect and await it to retrieve the Exit value
 */
export const forkAndAwait = <A, E>(
	effect: Effect.Effect<A, E>,
): Effect.Effect<Exit.Exit<A, E>> => {
	return Effect.gen(function* () {
		const fiber = yield* Effect.fork(effect)
		return yield* Fiber.await(fiber)
	})
}

/**
 * Fork Effect.never, then interrupt it.
 * Return true if the exit is a Failure (i.e. interruption succeeded).
 */
export const interruptFiber = (): Effect.Effect<boolean> => {
	return Effect.gen(function* () {
		const fiber = yield* Effect.fork(Effect.never)
		const exit = yield* Fiber.interrupt(fiber)
		return Exit.isFailure(exit)
	})
}

/**
 * Fork two effects as daemon fibers
 */
export const forkDaemons = <A, B>(
	effectA: Effect.Effect<A>,
	effectB: Effect.Effect<B>,
): Effect.Effect<readonly [Fiber.RuntimeFiber<A, never>, Fiber.RuntimeFiber<B, never>]> => {
	return Effect.gen(function* () {
		const fiberA = yield* Effect.forkDaemon(effectA)
		const fiberB = yield* Effect.forkDaemon(effectB)
		return [fiberA, fiberB] as const
	})
}

/**
 * Fork an effect and check if the fiber is running
 */
export const checkFiberStatus = (
	effect: Effect.Effect<string>,
): Effect.Effect<boolean> => {
	return Effect.gen(function* () {
		const fiber = yield* Effect.fork(effect)
		const status = yield* fiber.status
		return FiberStatus.isRunning(status) || FiberStatus.isSuspended(status)
	})
}
