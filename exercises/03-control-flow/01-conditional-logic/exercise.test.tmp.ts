import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit } from "effect"
import * as Exercise from "./solution"

describe("01-conditional-logic", () => {
	describe("effectIf", () => {
		it("should return success effect when condition is true", () => {
			const result = Effect.runSync(
				Exercise.effectIf(
					Effect.succeed(true),
					Effect.succeed("yes"),
					Effect.succeed("no"),
				),
			)
			expect(result).toBe("yes")
		})

		it("should return fallback effect when condition is false", () => {
			const result = Effect.runSync(
				Exercise.effectIf(
					Effect.succeed(false),
					Effect.succeed("yes"),
					Effect.succeed("no"),
				),
			)
			expect(result).toBe("no")
		})

		it("should work with numbers", () => {
			const result = Effect.runSync(
				Exercise.effectIf(
					Effect.succeed(true),
					Effect.succeed(42),
					Effect.succeed(0),
				),
			)
			expect(result).toBe(42)
		})
	})

	describe("filterAdult", () => {
		it("should succeed for age >= 18", () => {
			const result = Effect.runSync(Exercise.filterAdult(25))
			expect(result).toBe(25)
		})

		it("should succeed for exactly 18", () => {
			const result = Effect.runSync(Exercise.filterAdult(18))
			expect(result).toBe(18)
		})

		it("should fail for age < 18", () => {
			const exit = Effect.runSyncExit(Exercise.filterAdult(15))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should fail for age 0", () => {
			const exit = Effect.runSyncExit(Exercise.filterAdult(0))
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("matchShape", () => {
		it("should calculate circle area", () => {
			const result = Exercise.matchShape(new Exercise.Circle({ radius: 5 }))
			expect(result).toBeCloseTo(Math.PI * 25)
		})

		it("should calculate square area", () => {
			const result = Exercise.matchShape(new Exercise.Square({ side: 4 }))
			expect(result).toBe(16)
		})

		it("should calculate triangle area", () => {
			const result = Exercise.matchShape(
				new Exercise.Triangle({ base: 6, height: 3 }),
			)
			expect(result).toBe(9)
		})
	})

	describe("handleApiResponse", () => {
		it("should return data on success", () => {
			const result = Effect.runSync(
				Exercise.handleApiResponse(
					new Exercise.ApiSuccess({ data: "hello" }),
				),
			)
			expect(result).toBe("hello")
		})

		it("should fail on not found", () => {
			const exit = Effect.runSyncExit(
				Exercise.handleApiResponse(
					new Exercise.ApiNotFound({ id: "123" }),
				),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should fail on rate limited", () => {
			const exit = Effect.runSyncExit(
				Exercise.handleApiResponse(
					new Exercise.ApiRateLimited({ retryAfter: 30 }),
				),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should fail on server error", () => {
			const exit = Effect.runSyncExit(
				Exercise.handleApiResponse(
					new Exercise.ApiServerError({ code: 500 }),
				),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("validateAndTransform", () => {
		it("should fail for negative age", () => {
			const exit = Effect.runSyncExit(Exercise.validateAndTransform(-5))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should return 'child' for age < 13", () => {
			const result = Effect.runSync(Exercise.validateAndTransform(5))
			expect(result).toBe("child")
		})

		it("should return 'teenager' for age 13-17", () => {
			const result = Effect.runSync(Exercise.validateAndTransform(15))
			expect(result).toBe("teenager")
		})

		it("should return 'adult' for age 18-64", () => {
			const result = Effect.runSync(Exercise.validateAndTransform(30))
			expect(result).toBe("adult")
		})

		it("should return 'senior' for age >= 65", () => {
			const result = Effect.runSync(Exercise.validateAndTransform(70))
			expect(result).toBe("senior")
		})
	})
})
