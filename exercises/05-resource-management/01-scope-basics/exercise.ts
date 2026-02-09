import { Effect, Ref, Scope } from "effect"

/**
 * TODO: Attach a finalizer to the given effect using Effect.ensuring.
 * The finalizer should append "finalized" to the log ref.
 * Return the original effect's result.
 */
export const withEnsuring = (
	effect: Effect.Effect<string>,
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<string> => {
	// Your code here
	return Effect.succeed("") // Replace with correct implementation
}

/**
 * TODO: Create a managed resource using Effect.acquireRelease.
 * - Acquire: append "acquired" to the log ref, return "resource"
 * - Release: append "released" to the log ref
 *
 * The returned effect requires a Scope.
 */
export const managedResource = (
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<string, never, Scope.Scope> => {
	// Your code here
	return Effect.succeed("") // Replace with correct implementation
}

/**
 * TODO: Use Effect.scoped + managedResource to:
 * 1. Acquire the resource
 * 2. Append "used" to the log
 * 3. Return the resource value
 *
 * After scoped exits, "released" should be in the log.
 */
export const scopedResource = (
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<string> => {
	// Your code here
	return Effect.succeed("") // Replace with correct implementation
}

/**
 * TODO: Use Effect.addFinalizer inside a scoped block.
 * The finalizer should append the exit _tag ("Success" or "Failure")
 * to the log ref.
 * Return "done" from the scoped block.
 */
export const addFinalizerExample = (
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<string> => {
	// Your code here
	return Effect.succeed("") // Replace with correct implementation
}

/**
 * TODO: Acquire two resources (A then B) within a scope.
 * Each resource appends "acquire:X" on acquire and "release:X" on release.
 * Verify that release happens in reverse order (B before A).
 *
 * Return the final log as an array.
 */
export const multipleResources = (): Effect.Effect<ReadonlyArray<string>> => {
	// Your code here
	return Effect.succeed([]) // Replace with correct implementation
}
