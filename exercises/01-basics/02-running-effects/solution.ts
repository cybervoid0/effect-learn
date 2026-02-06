import { Effect, Exit, Fiber } from "effect"

/**
 * Run a simple synchronous Effect and return its result
 */
export const runSimpleEffect = (effect: Effect.Effect<number>): number => {
	return Effect.runSync(effect)
}

/**
 * Run an Effect and return the Exit result
 */
export const runEffectWithExit = <A, E>(
	effect: Effect.Effect<A, E>,
): Exit.Exit<A, E> => {
	return Effect.runSyncExit(effect)
}

/**
 * Run an asynchronous Effect and return a Promise
 */
export const runAsyncEffect = async <A>(
	effect: Effect.Effect<A>,
): Promise<A> => {
	return await Effect.runPromise(effect)
}

/**
 * Run an Effect in the background and return the Fiber
 */
export const runEffectInBackground = <A, E>(
	effect: Effect.Effect<A, E>,
): Fiber.RuntimeFiber<A, E> => {
	return Effect.runFork(effect)
}
