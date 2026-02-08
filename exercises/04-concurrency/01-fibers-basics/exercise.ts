import { Effect as E, Exit, Fiber, FiberStatus } from "effect"

/**
 * TODO: Fork the given effect into a fiber,
 * then join it to retrieve the result.
 */
export const forkAndJoin = <A, E>(effect: E.Effect<A, E>): E.Effect<A, E> => {
	// Your code here
	return E.fork(effect).pipe(E.flatMap(Fiber.join))
}
/**
 * TODO: Fork the given effect into a fiber,
 * then await it to retrieve the Exit value.
 */
export const forkAndAwait = <A, E>(
	effect: E.Effect<A, E>,
): E.Effect<Exit.Exit<A, E>> => {
	// Your code here
	return E.fork(effect).pipe(E.flatMap(Fiber.await))
}

/**
 * TODO: Fork a long-running effect (Effect.never),
 * then interrupt the fiber.
 * Return true if the interruption was successful
 * (i.e. the exit is a Failure).
 */
export const interruptFiber = (): E.Effect<boolean> => {
	// Your code here
	return E.fork(E.never).pipe(E.flatMap(Fiber.interrupt), E.map(Exit.isFailure))
}

/**
 * TODO: Fork two effects as daemon fibers,
 * return a tuple of both fibers.
 * Daemon fibers are not interrupted when the parent scope ends.
 */
export const forkDaemons = <A, B>(
	effectA: E.Effect<A>,
	effectB: E.Effect<B>,
): E.Effect<
	readonly [Fiber.RuntimeFiber<A, never>, Fiber.RuntimeFiber<B, never>]
> => {
	// Your code here

	return E.forkDaemon(effectA).pipe(E.zip(E.forkDaemon(effectB)))
}

/**
 * TODO: Fork the given effect and immediately check
 * whether the fiber is in a "Running" or "Suspended" state.
 * Return the status check result (boolean).
 *
 * Hint: use fiber.status and FiberStatus.isRunning / FiberStatus.isSuspended
 */
export const checkFiberStatus = (
	effect: E.Effect<string>,
): E.Effect<boolean> => {
	// Your code here
	return E.fork(effect).pipe(
		E.flatMap((fib) => fib.status),
		E.andThen(
			(status) =>
				FiberStatus.isRunning(status) || FiberStatus.isSuspended(status),
		),
	)
}
