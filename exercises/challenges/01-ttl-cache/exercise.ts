import {
	Context,
	Data,
	Effect,
	HashMap,
	Layer,
	Option,
	Ref,
	type Scope,
} from "effect"

// ============================================================
// Types
// ============================================================

export interface CacheEntry {
	readonly value: string
	readonly expiresAt: number
}

// ============================================================
// Error
// ============================================================

// TODO: Define CacheMiss tagged error with a `key` field
export class CacheMiss extends Data.TaggedError("CacheMiss")<{
	readonly key: string
}> {}

// ============================================================
// Service
// ============================================================

// TODO: Define TtlCache service tag with:
//   get:    (key: string) => Effect.Effect<string, CacheMiss>
//   set:    (key: string, value: string) => Effect.Effect<void>
//   remove: (key: string) => Effect.Effect<void>
//   size:   Effect.Effect<number>
interface TtlCacheApi {
	get: (key: string) => Effect.Effect<string, CacheMiss>
	set: (key: string, value: string) => Effect.Effect<void>
	remove: (key: string) => Effect.Effect<void>
	size: Effect.Effect<number>
}

export class TtlCache extends Context.Tag("TtlCache")<
	TtlCache,
	TtlCacheApi
>() {}

// ============================================================
// Layer
// ============================================================

// TODO: Build a Layer that:
// 1. Creates Ref<HashMap<string, CacheEntry>> for state
// 2. Forks a background fiber that cleans expired entries every ttl/2 ms
// 3. Registers a finalizer to interrupt the cleanup fiber
// 4. Returns TtlCache implementation
//
// get:    check expiry before returning, fail with CacheMiss if expired/missing
// set:    store { value, expiresAt: Date.now() + ttl }
// remove: delete from HashMap
// size:   count entries where expiresAt > Date.now()

export const ttlCacheLive = (
	ttl: number,
): Layer.Layer<TtlCache, never, Scope.Scope> =>
	Layer.scoped(TtlCache)(
		Effect.gen(function* () {
			const cache = yield* Ref.make(HashMap.empty<string, CacheEntry>())
			yield* Effect.forkScoped(
				Effect.forever(
					Ref.update(
						cache,
						HashMap.filter((entry) => entry.expiresAt > Date.now()),
					).pipe(Effect.delay(ttl / 2)),
				),
			)
			return TtlCache.of({
				get: (key) =>
					Effect.gen(function* () {
						const map = yield* Ref.get(cache)
						return yield* Option.match(HashMap.get(map, key), {
							onNone: () => Effect.fail(new CacheMiss({ key })),
							onSome: (e) =>
								e.expiresAt > Date.now()
									? Effect.succeed(e.value)
									: Effect.fail(new CacheMiss({ key })),
						})
					}),
				set: (key, val) =>
					Ref.update(
						cache,
						HashMap.set(key, { value: val, expiresAt: Date.now() + ttl }),
					),
				remove: (key) => Ref.update(cache, HashMap.remove(key)),
				size: Effect.gen(function* () {
					const map = yield* Ref.get(cache)
					const now = Date.now()
					return HashMap.countBy(map, ({ expiresAt }) => expiresAt > now)
				}),
			})
		}),
	)

// ============================================================
// Program 1: Get or compute
// ============================================================

// Get value from cache. On CacheMiss:
// 1. Call `compute` to get the value
// 2. Store it in cache
// 3. Return the computed value
export const getOrSet = (
	key: string,
	compute: Effect.Effect<string>,
): Effect.Effect<string, never, TtlCache> => {
	return Effect.gen(function* () {
		const cache = yield* TtlCache
		const val = cache.get(key)
		return yield* val.pipe(
			Effect.catchTag("CacheMiss", () =>
				Effect.gen(function* () {
					const val = yield* compute
					yield* cache.set(key, val)
					return val
				}),
			),
		)
	})
}

// ============================================================
// Program 2: Cached parallel lookup
// ============================================================

// 1. For each key in parallel:
//    - Try cache.get(key)
//    - On CacheMiss: call lookup(key), cache the result, return it
// 2. Return all results as Array<string>
export const cachedLookup = (
	keys: ReadonlyArray<string>,
	lookup: (key: string) => Effect.Effect<string>,
): Effect.Effect<Array<string>, never, TtlCache> => {
	// Your code here
	return Effect.forEach(keys, (key) => getOrSet(key, lookup(key)), {
		concurrency: "unbounded",
	})
}
