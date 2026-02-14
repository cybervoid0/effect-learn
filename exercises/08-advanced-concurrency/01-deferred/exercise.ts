import { Effect, Deferred } from "effect"

/**
 * TODO: Create a Deferred<string, never>, complete it with "hello",
 * then await and return the value.
 *
 * Hint: Deferred.make<string, never>(), Deferred.succeed, Deferred.await.
 */
export const createAndComplete: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Create a Deferred<string, string>, fail it with "error",
 * then await it and use Effect.catchAll to return the error message as a string.
 *
 * Hint: Deferred.fail completes with an error, catchAll recovers from it.
 */
export const deferredWithFailure: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Create a Deferred<number, never>.
 * Fork a fiber that awaits the Deferred.
 * Succeed the Deferred with 42.
 * Join the fiber and return the result.
 *
 * Hint: The forked fiber will block on Deferred.await until you call Deferred.succeed.
 */
export const waitForSignal: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a Deferred<void, never>.
 * Check isDone (should be false).
 * Succeed the Deferred.
 * Check isDone again (should be true).
 * Return [before, after] as a readonly tuple.
 *
 * Hint: Deferred.isDone returns Effect<boolean>.
 */
export const isDoneCheck: Effect.Effect<readonly [boolean, boolean]> = Effect.succeed([false, false] as const) // Replace with correct implementation

/**
 * TODO: Create two Deferreds: d1<string, never> and d2<string, never>.
 * Fork fiber 1: succeed d1 with "ping", then await d2, return d2's value.
 * Fork fiber 2: await d1, then succeed d2 with "pong", return d1's value.
 * Join both fibers and return [f1result, f2result].
 *
 * Hint: This creates a handshake pattern where each fiber sends and receives.
 */
export const handshake: Effect.Effect<readonly [string, string]> = Effect.succeed(["", ""] as const) // Replace with correct implementation
