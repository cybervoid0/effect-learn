import { Effect as E, Ref, type Scope } from "effect"

/**
 * TODO: Attach a finalizer to the given effect using Effect.ensuring.
 * The finalizer should append "finalized" to the log ref.
 * Return the original effect's result.
 */
export const withEnsuring = (
	effect: E.Effect<string>,
	log: Ref.Ref<ReadonlyArray<string>>,
): E.Effect<string> => {
	// Your code here
	return effect.pipe(
		E.ensuring(Ref.update(log, (arr) => [...arr, "finalized"])),
	)
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
): E.Effect<string, never, Scope.Scope> => {
	// Your code here
	return E.acquireRelease(
		Ref.update(log, (arr) => [...arr, "acquired"]),
		() => Ref.update(log, (arr) => [...arr, "released"]),
	).pipe(E.as("resource"))
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
): E.Effect<string> => {
	// Your code here
	return E.scoped(
		E.gen(function* () {
			const resource = yield* managedResource(log)
			yield* Ref.update(log, (arr) => [...arr, "used"])
			return resource
		}),
	)
}

/**
 * TODO: Use Effect.addFinalizer inside a scoped block.
 * The finalizer should append the exit _tag ("Success" or "Failure")
 * to the log ref.
 * Return "done" from the scoped block.
 */
export const addFinalizerExample = (
	log: Ref.Ref<ReadonlyArray<string>>,
): E.Effect<string> => {
	// Your code here
	return E.scoped(
		E.gen(function* () {
			yield* E.addFinalizer((exit) =>
				Ref.update(log, (arr) => [...arr, exit._tag]),
			)
			return "done"
		}),
	)
}
/**
 * TODO: Acquire two resources (A then B) within a scope.
 * Each resource appends "acquire:X" on acquire and "release:X" on release.
 * Verify that release happens in reverse order (B before A).
 *
 * Return the final log as an array.
 */
export const multipleResources = (): E.Effect<ReadonlyArray<string>> => {
	return E.gen(function* () {
		const log = yield* Ref.make<ReadonlyArray<string>>([])

		yield* E.scoped(
			E.acquireRelease(
				Ref.update(log, (arr) => [...arr, "acquire:A"]),
				() => Ref.update(log, (arr) => [...arr, "release:A"]),
			).pipe(
				E.andThen(
					E.acquireRelease(
						Ref.update(log, (arr) => [...arr, "acquire:B"]),
						() => Ref.update(log, (arr) => [...arr, "release:B"]),
					),
				),
			),
		)

		return yield* Ref.get(log)
	})
}
