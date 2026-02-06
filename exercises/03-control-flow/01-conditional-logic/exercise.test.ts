import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit, Option } from "effect"
import * as Exercise from "./exercise"

describe("01-conditional-logic", () => {
	describe("conditionalEffect", () => {
		it("should return 'positive' for positive numbers", () => {
			const result = Effect.runSync(Exercise.conditionalEffect(5))
			expect(result).toBe("positive")
		})

		it("should return 'non-positive' for zero", () => {
			const result = Effect.runSync(Exercise.conditionalEffect(0))
			expect(result).toBe("non-positive")
		})

		it("should return 'non-positive' for negative numbers", () => {
			const result = Effect.runSync(Exercise.conditionalEffect(-5))
			expect(result).toBe("non-positive")
		})
	})

	describe("logIfTrue", () => {
		it("should return Some when condition is true", () => {
			const result = Effect.runSync(Exercise.logIfTrue(true, "test"))
			expect(Option.isSome(result)).toBe(true)
		})

		it("should return None when condition is false", () => {
			const result = Effect.runSync(Exercise.logIfTrue(false, "test"))
			expect(Option.isNone(result)).toBe(true)
		})
	})

	describe("failUnless", () => {
		it("should succeed when condition is true", () => {
			const result = Effect.runSync(Exercise.failUnless(true, "error"))
			expect(result).toBeUndefined()
		})

		it("should fail when condition is false", () => {
			const exit = Effect.runSyncExit(Exercise.failUnless(false, "error"))
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("filterPositive", () => {
		it("should succeed for positive numbers", () => {
			const result = Effect.runSync(Exercise.filterPositive(5))
			expect(result).toBe(5)
		})

		it("should fail for zero", () => {
			const exit = Effect.runSyncExit(Exercise.filterPositive(0))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should fail for negative numbers", () => {
			const exit = Effect.runSyncExit(Exercise.filterPositive(-5))
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("complexConditional", () => {
		it("should fail for negative numbers", () => {
			const exit = Effect.runSyncExit(Exercise.complexConditional(-5))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should return 'zero' for 0", () => {
			const result = Effect.runSync(Exercise.complexConditional(0))
			expect(result).toBe("zero")
		})

		it("should return 'small' for numbers < 10", () => {
			const result = Effect.runSync(Exercise.complexConditional(5))
			expect(result).toBe("small")
		})

		it("should return 'medium' for numbers < 100", () => {
			const result = Effect.runSync(Exercise.complexConditional(50))
			expect(result).toBe("medium")
		})

		it("should return 'large' for numbers >= 100", () => {
			const result = Effect.runSync(Exercise.complexConditional(150))
			expect(result).toBe("large")
		})
	})
})
