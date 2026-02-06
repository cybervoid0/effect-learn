import { Effect, Exit, Fiber } from "effect"

/**
 * TODO: Run a simple synchronous Effect and return its result
 */
export const runSimpleEffect = (effect: Effect.Effect<number>): number => {
	// Your code here
	return 0 // Replace with correct implementation
}

/**
 * TODO: Run an Effect and return the Exit result
 */
export const runEffectWithExit = <A, E>(
	effect: Effect.Effect<A, E>,
): Exit.Exit<A, E> => {
	// Your code here
	return Exit.succeed(undefined as A) // Replace with correct implementation
}

/**
 * TODO: Run an asynchronous Effect and return a Promise
 */
export const runAsyncEffect = async <A>(
	effect: Effect.Effect<A>,
): Promise<A> => {
	// Your code here
	return undefined as A // Replace with correct implementation
}

/**
 * TODO: Run an Effect in the background and return the Fiber
 */
export const runEffectInBackground = <A, E>(
	effect: Effect.Effect<A, E>,
): Fiber.RuntimeFiber<A, E> => {
	// Your code here
	return undefined as Fiber.RuntimeFiber<A, E> // Replace with correct implementation
}
