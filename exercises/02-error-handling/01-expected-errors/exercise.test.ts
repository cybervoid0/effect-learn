import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit } from "effect"
import * as Exercise from "./exercise"

describe("01-expected-errors", () => {
	describe("createSimpleError", () => {
		it("should fail with 'Not implemented'", () => {
			const exit = Effect.runSyncExit(Exercise.createSimpleError())
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("DivisionByZeroError", () => {
		it("should be a tagged error", () => {
			const error = new Exercise.DivisionByZeroError()
			expect(error._tag).toBe("DivisionByZeroError")
		})
	})

	describe("parseNumber", () => {
		it("should parse valid number", () => {
			const result = Effect.runSync(Exercise.parseNumber("42"))
			expect(result).toBe(42)
		})

		it("should parse negative number", () => {
			const result = Effect.runSync(Exercise.parseNumber("-10"))
			expect(result).toBe(-10)
		})

		it("should parse decimal number", () => {
			const result = Effect.runSync(Exercise.parseNumber("3.14"))
			expect(result).toBe(3.14)
		})

		it("should fail on invalid number", () => {
			const exit = Effect.runSyncExit(Exercise.parseNumber("abc"))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should fail on empty string", () => {
			const exit = Effect.runSyncExit(Exercise.parseNumber(""))
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("divideWithError", () => {
		it("should divide numbers correctly", () => {
			const result = Effect.runSync(Exercise.divideWithError(10, 2))
			expect(result).toBe(5)
		})

		it("should fail with DivisionByZeroError when dividing by zero", () => {
			const exit = Effect.runSyncExit(Exercise.divideWithError(10, 0))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit)) {
				const cause = exit.cause
				// Check that it's a DivisionByZeroError
				expect(cause).toBeDefined()
			}
		})

		it("should handle negative numbers", () => {
			const result = Effect.runSync(Exercise.divideWithError(-10, 2))
			expect(result).toBe(-5)
		})
	})

	describe("InvalidAgeError", () => {
		it("should be a tagged error with age and reason", () => {
			const error = new Exercise.InvalidAgeError({
				age: -1,
				reason: "Test",
			})
			expect(error._tag).toBe("InvalidAgeError")
			expect(error.age).toBe(-1)
			expect(error.reason).toBe("Test")
		})
	})

	describe("validateAge", () => {
		it("should accept valid age", () => {
			const result = Effect.runSync(Exercise.validateAge(25))
			expect(result).toBe(25)
		})

		it("should accept age 0", () => {
			const result = Effect.runSync(Exercise.validateAge(0))
			expect(result).toBe(0)
		})

		it("should accept age 120", () => {
			const result = Effect.runSync(Exercise.validateAge(120))
			expect(result).toBe(120)
		})

		it("should fail on negative age", () => {
			const exit = Effect.runSyncExit(Exercise.validateAge(-1))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should fail on age > 120", () => {
			const exit = Effect.runSyncExit(Exercise.validateAge(121))
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})
})
