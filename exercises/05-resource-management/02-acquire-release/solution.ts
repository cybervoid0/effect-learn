import { Effect, Exit, Ref } from "effect"

// ── Mock types ──

export interface MockFile {
	readonly name: string
	readonly content: string
}

// ── Solutions ──

/**
 * Use Effect.acquireUseRelease for a mock file
 */
export const acquireUseRelease = (
	file: MockFile,
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<string> => {
	return Effect.acquireUseRelease(
		Ref.update(log, (entries) => [...entries, `open:${file.name}`]).pipe(
			Effect.as(file),
		),
		(f) => Effect.succeed(f.content),
		(f) =>
			Ref.update(log, (entries) => [...entries, `close:${f.name}`]),
	)
}

/**
 * Error-aware release: commit on success, rollback on failure
 */
export const errorAwareRelease = <A>(
	operation: Effect.Effect<A, string>,
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<A, string> => {
	return Effect.acquireUseRelease(
		Ref.update(log, (entries) => [...entries, "begin"]),
		() => operation,
		(_, exit) =>
			Exit.isSuccess(exit)
				? Ref.update(log, (entries) => [...entries, "commit"])
				: Ref.update(log, (entries) => [...entries, "rollback"]),
	)
}

/**
 * Track outcome with Effect.onExit
 */
export const onExitTracking = <A>(
	effect: Effect.Effect<A, string>,
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<A, string> => {
	return effect.pipe(
		Effect.onExit((exit) =>
			Exit.isSuccess(exit)
				? Ref.update(log, (entries) => [...entries, "success"])
				: Ref.update(log, (entries) => [...entries, "failure"]),
		),
	)
}

/**
 * Only clean up on interruption
 */
export const onInterruptCleanup = (
	effect: Effect.Effect<void>,
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<void> => {
	return effect.pipe(
		Effect.onInterrupt(() =>
			Ref.update(log, (entries) => [...entries, "interrupted"]),
		),
	)
}

/**
 * Nested acquireUseRelease — inner closes before outer
 */
export const nestedResources = (): Effect.Effect<ReadonlyArray<string>> => {
	return Effect.gen(function* () {
		const log = yield* Ref.make<ReadonlyArray<string>>([])

		yield* Effect.acquireUseRelease(
			Ref.update(log, (entries) => [...entries, "open:outer"]),
			() =>
				Effect.acquireUseRelease(
					Ref.update(log, (entries) => [...entries, "open:inner"]),
					() => Ref.update(log, (entries) => [...entries, "use"]),
					() =>
						Ref.update(log, (entries) => [...entries, "close:inner"]),
				),
			() =>
				Ref.update(log, (entries) => [...entries, "close:outer"]),
		)

		return yield* Ref.get(log)
	})
}
