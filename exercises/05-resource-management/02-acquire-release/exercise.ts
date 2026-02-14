import { Effect as E, Exit, Ref } from "effect"

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
): E.Effect<string, unknown, unknown> => {
	// Your code here
	return E.acquireUseRelease(
		E.gen(function* () {
			yield* Ref.update(log, (arr) => [...arr, `open:${file.name}`])
			return file
		}),
		(mockFile) => E.succeed(mockFile.content),
		(mockFile) => Ref.update(log, (arr) => [...arr, `close:${mockFile.name}`]),
	)
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
	operation: E.Effect<A, string>,
	log: Ref.Ref<ReadonlyArray<string>>,
): E.Effect<A, string> => {
	// Your code here
	return E.acquireUseRelease(
		Ref.update(log, (arr) => [...arr, "begin"]),
		() => operation,
		(_, exit) =>
			Ref.update(log, (arr) => [
				...arr,
				Exit.isSuccess(exit) ? "commit" : "rollback",
			]),
	)
}

/**
 * TODO: Use Effect.onExit to track the outcome of an effect.
 * - On success: append "success" to the log
 * - On failure: append "failure" to the log
 *
 * Return the original effect's result.
 */
export const onExitTracking = <A>(
	effect: E.Effect<A, string>,
	log: Ref.Ref<ReadonlyArray<string>>,
): E.Effect<A, string> => {
	// Your code here
	return effect.pipe(
		E.onExit((exit) =>
			Ref.update(log, (arr) => [
				...arr,
				Exit.isSuccess(exit) ? "success" : "failure",
			]),
		),
	)
}

/**
 * TODO: Use Effect.onInterrupt to register a cleanup
 * that only fires when the effect is interrupted.
 * Append "interrupted" to the log on interruption.
 */
export const onInterruptCleanup = (
	effect: E.Effect<void>,
	log: Ref.Ref<ReadonlyArray<string>>,
): E.Effect<void> => {
	// Your code here
	return effect.pipe(
		E.onInterrupt(() => Ref.update(log, (arr) => [...arr, "interrupted"])),
	)
}

/**
 * TODO: Nest two acquireUseRelease calls.
 * Outer resource: append "open:outer" / "close:outer"
 * Inner resource: append "open:inner" / "close:inner"
 * Use phase: append "use"
 *
 * Return the final log. Expect inner to close before outer.
 */
export const nestedResources = (): E.Effect<ReadonlyArray<string>> => {
	// Your code here
	//return E.succeed([]) // Replace with correct implementation
	return E.gen(function* () {
		const log = yield* Ref.make<string[]>([])
		yield* E.acquireUseRelease(
			Ref.update(log, (arr) => [...arr, "open:outer"]),
			() =>
				E.acquireUseRelease(
					Ref.update(log, (arr) => [...arr, "open:inner"]),
					() => Ref.update(log, (arr) => [...arr, "use"]),
					() => Ref.update(log, (arr) => [...arr, "close:inner"]),
				),
			() => Ref.update(log, (arr) => [...arr, "close:outer"]),
		)
		return yield* Ref.get(log)
	})
}
