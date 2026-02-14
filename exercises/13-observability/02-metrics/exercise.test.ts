import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("02-metrics", () => {
	describe("incrementCounter", () => {
		it.effect("should return 3 after incrementing counter 3 times", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.incrementCounter
				expect(result).toBe(3)
			}),
		)
	})

	describe("setGauge", () => {
		it.effect("should return 36.6 after setting gauge", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.setGauge
				expect(result).toBeCloseTo(36.6)
			}),
		)
	})

	describe("trackWithHistogram", () => {
		it.effect("should return 42 after tracking with histogram", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.trackWithHistogram
				expect(result).toBe(42)
			}),
		)
	})

	describe("taggedCounter", () => {
		it.effect("should return 'tagged' after incrementing tagged counter", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.taggedCounter
				expect(result).toBe("tagged")
			}),
		)
	})

	describe("countAndReturn", () => {
		it.effect("should return 5 after running effect 5 times", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.countAndReturn
				expect(result).toBe(5)
			}),
		)
	})
})
