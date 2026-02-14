import { Chunk, Effect, Either, Ref, Schedule, Stream } from "effect"

/**
 * TODO: Create a stream that fails with "error", then use
 * Stream.catchAll to recover and emit "recovered".
 * Collect and return as a readonly array.
 * Expected: ["recovered"]
 */
export const streamCatchAll = (): Effect.Effect<readonly string[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Create a stream that fails with "err", then use
 * Stream.orElse to fall back to a stream emitting "fallback".
 * Collect and return as a readonly array.
 * Expected: ["fallback"]
 */
export const streamOrElse = (): Effect.Effect<readonly string[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Use a Ref to track the number of attempts.
 * Create a stream (via Stream.fromEffect) that:
 * - Reads and increments the Ref
 * - Fails on the first attempt (when count was 0)
 * - Succeeds with "success" on the second attempt
 * Apply Stream.retry(Schedule.once) so it retries once.
 * Collect and return as a readonly array.
 * Expected: ["success"]
 */
export const streamWithRetry = (): Effect.Effect<readonly string[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Create a stream that emits 1, 2, then fails with "oops".
 * Use Stream.catchAll to recover by emitting 0.
 * Collect and return as a readonly array.
 * Expected: [1, 2, 0]
 */
export const partialStream = (): Effect.Effect<readonly number[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}

/**
 * TODO: Create a stream of [2, 3, 4] and use Stream.mapEffect to:
 * - Succeed with the number if it is even
 * - Fail with "odd" if it is odd
 * Wrap with Stream.either to capture errors as Either values.
 * Map each Either to a string: "right:<number>" or "left:<error>".
 * Collect and return as a readonly array.
 * Expected: ["right:2", "left:odd", "right:4"]
 */
export const streamEither = (): Effect.Effect<readonly string[]> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}
