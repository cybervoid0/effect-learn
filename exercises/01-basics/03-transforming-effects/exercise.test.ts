import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("03-transforming-effects", () => {
	describe("doubleValue", () => {
		it("should double the value", () => {
			const effect = Effect.succeed(21)
			const result = Effect.runSync(Exercise.doubleValue(effect))
			expect(result).toBe(42)
		})
	})

	describe("chainEffects", () => {
		it("should chain two effects", () => {
			const first = Effect.succeed(10)
			const double = (n: number) => Effect.succeed(n * 2)
			const result = Effect.runSync(Exercise.chainEffects(first, double))
			expect(result).toBe(20)
		})
	})

	describe("transformToString", () => {
		it("should transform number to string", () => {
			const effect = Effect.succeed(42)
			const result = Effect.runSync(Exercise.transformToString(effect))
			expect(result).toBe("42")
			expect(typeof result).toBe("string")
		})
	})

	describe("logAndReturn", () => {
		it("should return the same value", () => {
			const effect = Effect.succeed(42)
			const result = Effect.runSync(Exercise.logAndReturn(effect))
			expect(result).toBe(42)
		})

		it("should work with different types", () => {
			const effect = Effect.succeed("hello")
			const result = Effect.runSync(Exercise.logAndReturn(effect))
			expect(result).toBe("hello")
		})
	})

	describe("calculateTotal", () => {
		it("should perform complex composition", () => {
			const result = Effect.runSync(Exercise.calculateTotal(5))
			// (5 + 10) * 2 = 30
			expect(result).toBe("Result: 30")
		})

		it("should work with different inputs", () => {
			const result = Effect.runSync(Exercise.calculateTotal(0))
			// (0 + 10) * 2 = 20
			expect(result).toBe("Result: 20")
		})
	})
})
