import { Effect, Exit, Ref } from "effect"

// ── Mock types for exercises ──

export interface MockFile {
	readonly name: string
	readonly content: string
}

// ── Exercises ──

/**
 * TODO: Use Effect.acquireUseRelease to:
 * 1. Acquire: create a MockFile and append "open:{name}" to the log
 * 2. Use: return the file's content
 * 3. Release: append "close:{name}" to the log
 */
export const acquireUseRelease = (
	file: MockFile,
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<string> => {
	// Your code here
	return Effect.succeed("") // Replace with correct implementation
}

/**
 * TODO: Use Effect.acquireUseRelease with error-aware release.
 * - Acquire: append "begin" to the log
 * - Use: run the provided `operation` effect
 * - Release: if success → append "commit", if failure → append "rollback"
 *
 * Hint: check exit with Exit.isSuccess(exit)
 */
export const errorAwareRelease = <A>(
	operation: Effect.Effect<A, string>,
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<A, string> => {
	// Your code here
	return Effect.succeed(undefined as A) // Replace with correct implementation
}

/**
 * TODO: Use Effect.onExit to track the outcome of an effect.
 * - On success: append "success" to the log
 * - On failure: append "failure" to the log
 *
 * Return the original effect's result.
 */
export const onExitTracking = <A>(
	effect: Effect.Effect<A, string>,
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<A, string> => {
	// Your code here
	return Effect.succeed(undefined as A) // Replace with correct implementation
}

/**
 * TODO: Use Effect.onInterrupt to register a cleanup
 * that only fires when the effect is interrupted.
 * Append "interrupted" to the log on interruption.
 */
export const onInterruptCleanup = (
	effect: Effect.Effect<void>,
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<void> => {
	// Your code here
	return Effect.void // Replace with correct implementation
}

/**
 * TODO: Nest two acquireUseRelease calls.
 * Outer resource: append "open:outer" / "close:outer"
 * Inner resource: append "open:inner" / "close:inner"
 * Use phase: append "use"
 *
 * Return the final log. Expect inner to close before outer.
 */
export const nestedResources = (): Effect.Effect<ReadonlyArray<string>> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}
