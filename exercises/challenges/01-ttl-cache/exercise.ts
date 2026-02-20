import {
	Context,
	Data,
	Effect,
	Fiber,
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

export class TtlCache extends Context.Tag("TtlCache")<
	TtlCache,
	Record<string, never> // <-- Replace with real interface
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
	Layer.succeed(TtlCache, {} as never) // <-- Replace with Layer.scoped(...)

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
	// Your code here
	return Effect.succeed("TODO") as never
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
	return Effect.succeed([]) as never
}
