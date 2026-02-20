import { describe, it, expect } from "vitest"
import { Effect, Fiber, Ref, Scope, TestClock, Duration } from "effect"
import {
	CacheMiss,
	TtlCache,
	ttlCacheLive,
	getOrSet,
	cachedLookup,
} from "./exercise"

const TTL = 1000

const withCache = <A, E>(
	program: Effect.Effect<A, E, TtlCache>,
): Effect.Effect<A, E, never> =>
	program.pipe(Effect.provide(ttlCacheLive(TTL)), Effect.scoped)

describe("challenges / 01-ttl-cache", () => {
	describe("CacheMiss error", () => {
		it("should be a tagged error with key field", () => {
			const error = new CacheMiss({ key: "foo" })
			expect(error._tag).toBe("CacheMiss")
			expect(error.key).toBe("foo")
		})
	})

	describe("TtlCache service", () => {
		it("get should return value after set", async () => {
			const program = Effect.gen(function* () {
				const cache = yield* TtlCache
				yield* cache.set("name", "Alice")
				return yield* cache.get("name")
			})
			const result = await Effect.runPromise(withCache(program))
			expect(result).toBe("Alice")
		})

		it("get should fail with CacheMiss for missing key", async () => {
			const program = Effect.gen(function* () {
				const cache = yield* TtlCache
				return yield* cache.get("missing").pipe(
					Effect.catchTag("CacheMiss", (e) =>
						Effect.succeed(`miss:${e.key}`),
					),
				)
			})
			const result = await Effect.runPromise(withCache(program))
			expect(result).toBe("miss:missing")
		})

		it("set should overwrite existing entries", async () => {
			const program = Effect.gen(function* () {
				const cache = yield* TtlCache
				yield* cache.set("key", "first")
				yield* cache.set("key", "second")
				return yield* cache.get("key")
			})
			const result = await Effect.runPromise(withCache(program))
			expect(result).toBe("second")
		})

		it("remove should delete an entry", async () => {
			const program = Effect.gen(function* () {
				const cache = yield* TtlCache
				yield* cache.set("key", "value")
				yield* cache.remove("key")
				return yield* cache.get("key").pipe(
					Effect.catchTag("CacheMiss", () =>
						Effect.succeed("removed"),
					),
				)
			})
			const result = await Effect.runPromise(withCache(program))
			expect(result).toBe("removed")
		})

		it("size should count only non-expired entries", async () => {
			const program = Effect.gen(function* () {
				const cache = yield* TtlCache
				yield* cache.set("a", "1")
				yield* cache.set("b", "2")
				yield* cache.set("c", "3")
				return yield* cache.size
			})
			const result = await Effect.runPromise(withCache(program))
			expect(result).toBe(3)
		})

		it("get should fail with CacheMiss after TTL expires", async () => {
			const program = Effect.gen(function* () {
				const cache = yield* TtlCache
				yield* cache.set("temp", "value")
				yield* Effect.sleep(Duration.millis(TTL + 100))
				return yield* cache.get("temp").pipe(
					Effect.catchTag("CacheMiss", () =>
						Effect.succeed("expired"),
					),
				)
			})
			const result = await Effect.runPromise(withCache(program))
			expect(result).toBe("expired")
		})
	})

	describe("getOrSet", () => {
		it("should return cached value on hit", async () => {
			const callCount = { value: 0 }
			const compute = Effect.sync(() => {
				callCount.value++
				return "computed"
			})

			const program = Effect.gen(function* () {
				const cache = yield* TtlCache
				yield* cache.set("key", "cached")
				return yield* getOrSet("key", compute)
			})

			const result = await Effect.runPromise(withCache(program))
			expect(result).toBe("cached")
			expect(callCount.value).toBe(0)
		})

		it("should compute and cache on miss", async () => {
			const program = Effect.gen(function* () {
				const cache = yield* TtlCache
				const value = yield* getOrSet(
					"key",
					Effect.succeed("computed"),
				)
				const cached = yield* cache.get("key")
				return { value, cached }
			})

			const result = await Effect.runPromise(withCache(program))
			expect(result.value).toBe("computed")
			expect(result.cached).toBe("computed")
		})
	})

	describe("cachedLookup", () => {
		it("should use cache for hits and lookup for misses", async () => {
			const lookupCount = { value: 0 }

			const program = Effect.gen(function* () {
				const cache = yield* TtlCache
				yield* cache.set("a", "cached-a")

				return yield* cachedLookup(["a", "b", "c"], (key) =>
					Effect.sync(() => {
						lookupCount.value++
						return `looked-up-${key}`
					}),
				)
			})

			const result = await Effect.runPromise(withCache(program))
			expect(result).toEqual([
				"cached-a",
				"looked-up-b",
				"looked-up-c",
			])
			expect(lookupCount.value).toBe(2)
		})

		it("should cache looked-up values for subsequent calls", async () => {
			const lookupCount = { value: 0 }
			const lookup = (key: string) =>
				Effect.sync(() => {
					lookupCount.value++
					return `result-${key}`
				})

			const program = Effect.gen(function* () {
				const first = yield* cachedLookup(["x"], lookup)
				const second = yield* cachedLookup(["x"], lookup)
				return { first, second }
			})

			const result = await Effect.runPromise(withCache(program))
			expect(result.first).toEqual(["result-x"])
			expect(result.second).toEqual(["result-x"])
			expect(lookupCount.value).toBe(1)
		})
	})
})
