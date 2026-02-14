import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("03-tracing", () => {
	describe("withSimpleSpan", () => {
		it.effect("should return 42 wrapped in a span", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.withSimpleSpan
				expect(result).toBe(42)
			}),
		)
	})

	describe("nestedSpans", () => {
		it.effect("should return 'done' with nested spans", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.nestedSpans
				expect(result).toBe("done")
			}),
		)
	})

	describe("annotatedSpan", () => {
		it.effect("should return 'annotated' with annotated span", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.annotatedSpan
				expect(result).toBe("annotated")
			}),
		)
	})

	describe("spanWithEffect", () => {
		it.effect("should return 'data' after sleeping in a span", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.spanWithEffect
				expect(result).toBe("data")
			}),
		)
	})

	describe("getCurrentSpan", () => {
		it.effect("should return the current span name 'test'", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.getCurrentSpan
				expect(result).toBe("test")
			}),
		)
	})
})
