import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./solution"

describe("02-caching-effects", () => {
	it.effect("cachedEffect should return the same value for all 3 calls", () =>
		Effect.gen(function* () {
			const [a, b, c] = yield* Exercise.cachedEffect
			expect(a).toBe(1)
			expect(b).toBe(1)
			expect(c).toBe(1)
		})
	)

	it.effect("uncachedEffect should return different values for each call", () =>
		Effect.gen(function* () {
			const [a, b, c] = yield* Exercise.uncachedEffect
			expect(a).toBe(1)
			expect(b).toBe(2)
			expect(c).toBe(3)
		})
	)

	it.effect("cachedOnce should return 1 (effect runs only once)", () =>
		Effect.gen(function* () {
			const result = yield* Exercise.cachedOnce
			expect(result).toBe(1)
		})
	)

	it.effect("memoizedFunction should return true (call count is 1)", () =>
		Effect.gen(function* () {
			const result = yield* Exercise.memoizedFunction
			expect(result).toBe(true)
		})
	)

	it.effect("manualCache should return (42, 42)", () =>
		Effect.gen(function* () {
			const [first, second] = yield* Exercise.manualCache
			expect(first).toBe(42)
			expect(second).toBe(42)
		})
	)
})
