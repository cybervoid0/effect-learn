import {
	Context,
	Data,
	Effect,
	Fiber,
	HashMap,
	Layer,
	Option,
	Ref,
	Scope,
} from "effect"

// Types
export interface CacheEntry {
	readonly value: string
	readonly expiresAt: number
}

// Error
export class CacheMiss extends Data.TaggedError("CacheMiss")<{
	readonly key: string
}> {}

// Service
export class TtlCache extends Context.Tag("TtlCache")<
	TtlCache,
	{
		readonly get: (key: string) => Effect.Effect<string, CacheMiss>
		readonly set: (key: string, value: string) => Effect.Effect<void>
		readonly remove: (key: string) => Effect.Effect<void>
		readonly size: Effect.Effect<number>
	}
>() {}

// Layer
export const ttlCacheLive = (
	ttl: number,
): Layer.Layer<TtlCache, never, Scope.Scope> =>
	Layer.scoped(
		TtlCache,
		Effect.gen(function* () {
			const state = yield* Ref.make(
				HashMap.empty<string, CacheEntry>(),
			)

			const now = Effect.sync(() => Date.now())

			const cleanup = Effect.gen(function* () {
				const currentTime = yield* now
				yield* Ref.update(state, HashMap.filter((entry) =>
					entry.expiresAt > currentTime,
				))
			})

			const fiber = yield* Effect.forkScoped(
				Effect.forever(cleanup.pipe(Effect.delay(ttl / 2))),
			)

			return {
				get: (key: string) =>
					Effect.gen(function* () {
						const map = yield* Ref.get(state)
						const entry = HashMap.get(map, key)
						if (Option.isNone(entry)) {
							return yield* Effect.fail(
								new CacheMiss({ key }),
							)
						}
						const currentTime = yield* now
						if (entry.value.expiresAt <= currentTime) {
							yield* Ref.update(state, HashMap.remove(key))
							return yield* Effect.fail(
								new CacheMiss({ key }),
							)
						}
						return entry.value.value
					}),

				set: (key: string, value: string) =>
					Effect.gen(function* () {
						const currentTime = yield* now
						yield* Ref.update(
							state,
							HashMap.set(key, {
								value,
								expiresAt: currentTime + ttl,
							}),
						)
					}),

				remove: (key: string) =>
					Ref.update(state, HashMap.remove(key)),

				size: Effect.gen(function* () {
					const map = yield* Ref.get(state)
					const currentTime = yield* now
					return HashMap.reduce(map, 0, (count, entry) =>
						entry.expiresAt > currentTime ? count + 1 : count,
					)
				}),
			}
		}),
	)

// Program 1: Get or compute
export const getOrSet = (
	key: string,
	compute: Effect.Effect<string>,
): Effect.Effect<string, never, TtlCache> =>
	Effect.gen(function* () {
		const cache = yield* TtlCache
		return yield* cache.get(key).pipe(
			Effect.catchTag("CacheMiss", () =>
				Effect.gen(function* () {
					const value = yield* compute
					yield* cache.set(key, value)
					return value
				}),
			),
		)
	})

// Program 2: Cached parallel lookup
export const cachedLookup = (
	keys: ReadonlyArray<string>,
	lookup: (key: string) => Effect.Effect<string>,
): Effect.Effect<Array<string>, never, TtlCache> =>
	Effect.gen(function* () {
		const cache = yield* TtlCache
		return yield* Effect.forEach(
			keys,
			(key) =>
				cache.get(key).pipe(
					Effect.catchTag("CacheMiss", () =>
						Effect.gen(function* () {
							const value = yield* lookup(key)
							yield* cache.set(key, value)
							return value
						}),
					),
				),
			{ concurrency: "unbounded" },
		)
	})
