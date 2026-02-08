import { Effect, Exit, Fiber } from "effect"

/**
 * TODO: Fork the given effect into a fiber,
 * then join it to retrieve the result.
 */
export const forkAndJoin = <A, E>(
	effect: Effect.Effect<A, E>,
): Effect.Effect<A, E> => {
	// Your code here
	return Effect.succeed(undefined as A) // Replace with correct implementation
}

/**
 * TODO: Fork the given effect into a fiber,
 * then await it to retrieve the Exit value.
 */
export const forkAndAwait = <A, E>(
	effect: Effect.Effect<A, E>,
): Effect.Effect<Exit.Exit<A, E>> => {
	// Your code here
	return Effect.succeed(Exit.void) // Replace with correct implementation
}

/**
 * TODO: Fork a long-running effect (Effect.never),
 * then interrupt the fiber.
 * Return true if the interruption was successful
 * (i.e. the exit is a Failure).
 */
export const interruptFiber = (): Effect.Effect<boolean> => {
	// Your code here
	return Effect.succeed(false) // Replace with correct implementation
}

/**
 * TODO: Fork two effects as daemon fibers,
 * return a tuple of both fibers.
 * Daemon fibers are not interrupted when the parent scope ends.
 */
export const forkDaemons = <A, B>(
	effectA: Effect.Effect<A>,
	effectB: Effect.Effect<B>,
): Effect.Effect<readonly [Fiber.RuntimeFiber<A, never>, Fiber.RuntimeFiber<B, never>]> => {
	// Your code here
	return Effect.succeed(undefined as never) // Replace with correct implementation
}

/**
 * TODO: Fork the given effect and immediately check
 * whether the fiber is in a "Running" or "Suspended" state.
 * Return the status check result (boolean).
 *
 * Hint: use fiber.status and FiberStatus.isRunning / FiberStatus.isSuspended
 */
export const checkFiberStatus = (
	effect: Effect.Effect<string>,
): Effect.Effect<boolean> => {
	// Your code here
	return Effect.succeed(false) // Replace with correct implementation
}
