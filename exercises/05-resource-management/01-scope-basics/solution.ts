import { Effect, Ref, Scope } from "effect"

/**
 * Attach a finalizer using Effect.ensuring
 */
export const withEnsuring = (
	effect: Effect.Effect<string>,
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<string> => {
	return effect.pipe(
		Effect.ensuring(
			Ref.update(log, (entries) => [...entries, "finalized"]),
		),
	)
}

/**
 * Create a managed resource with acquireRelease
 */
export const managedResource = (
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<string, never, Scope.Scope> => {
	return Effect.acquireRelease(
		Ref.update(log, (entries) => [...entries, "acquired"]).pipe(
			Effect.as("resource"),
		),
		() => Ref.update(log, (entries) => [...entries, "released"]),
	)
}

/**
 * Use Effect.scoped to safely acquire, use, and release
 */
export const scopedResource = (
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<string> => {
	return Effect.scoped(
		Effect.gen(function* () {
			const resource = yield* managedResource(log)
			yield* Ref.update(log, (entries) => [...entries, "used"])
			return resource
		}),
	)
}

/**
 * Use Effect.addFinalizer to register cleanup
 */
export const addFinalizerExample = (
	log: Ref.Ref<ReadonlyArray<string>>,
): Effect.Effect<string> => {
	return Effect.scoped(
		Effect.gen(function* () {
			yield* Effect.addFinalizer((exit) =>
				Ref.update(log, (entries) => [...entries, exit._tag]),
			)
			return "done"
		}),
	)
}

/**
 * Multiple resources release in reverse order (LIFO)
 */
export const multipleResources = (): Effect.Effect<ReadonlyArray<string>> => {
	return Effect.gen(function* () {
		const log = yield* Ref.make<ReadonlyArray<string>>([])

		const makeResource = (name: string) =>
			Effect.acquireRelease(
				Ref.update(log, (entries) => [...entries, `acquire:${name}`]).pipe(
					Effect.as(name),
				),
				() =>
					Ref.update(log, (entries) => [...entries, `release:${name}`]),
			)

		yield* Effect.scoped(
			Effect.gen(function* () {
				yield* makeResource("A")
				yield* makeResource("B")
			}),
		)

		return yield* Ref.get(log)
	})
}
