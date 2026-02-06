import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit } from "effect"
import * as Exercise from "./exercise"

describe("01-creating-effects", () => {
	describe("createSuccessEffect", () => {
		it("should return 42", () => {
			const result = Effect.runSync(Exercise.createSuccessEffect())
			expect(result).toBe(42)
		})
	})

	describe("createFailureEffect", () => {
		it("should fail with 'Something went wrong'", () => {
			const exit = Effect.runSyncExit(Exercise.createFailureEffect())
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("createRandomEffect", () => {
		it("should return a number between 0 and 100", () => {
			const result = Effect.runSync(Exercise.createRandomEffect())
			expect(result).toBeGreaterThanOrEqual(0)
			expect(result).toBeLessThanOrEqual(100)
		})

		it("should return different values on multiple calls", () => {
			const results = Array.from({ length: 10 }, () =>
				Effect.runSync(Exercise.createRandomEffect()),
			)
			const uniqueResults = new Set(results)
			// With 10 random numbers, we should have at least 2 unique values
			expect(uniqueResults.size).toBeGreaterThan(1)
		})
	})

	describe("createDateEffect", () => {
		it("should return a valid ISO date string", () => {
			const result = Effect.runSync(Exercise.createDateEffect())
			expect(typeof result).toBe("string")
			expect(new Date(result).toISOString()).toBe(result)
		})
	})

	describe("createDivisionEffect", () => {
		it("should divide two numbers correctly", () => {
			const result = Effect.runSync(Exercise.createDivisionEffect(10, 2))
			expect(result).toBe(5)
		})

		it("should fail when dividing by zero", () => {
			const exit = Effect.runSyncExit(Exercise.createDivisionEffect(10, 0))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should handle negative numbers", () => {
			const result = Effect.runSync(Exercise.createDivisionEffect(-10, 2))
			expect(result).toBe(-5)
		})
	})
})
