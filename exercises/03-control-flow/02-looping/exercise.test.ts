import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("02-looping", () => {
	describe("sumNumbers", () => {
		it("should sum numbers from 1 to n", () => {
			const result = Effect.runSync(Exercise.sumNumbers(5))
			// 1 + 2 + 3 + 4 + 5 = 15
			expect(result).toBe(15)
		})

		it("should return 1 for n=1", () => {
			const result = Effect.runSync(Exercise.sumNumbers(1))
			expect(result).toBe(1)
		})

		it("should return 55 for n=10", () => {
			const result = Effect.runSync(Exercise.sumNumbers(10))
			// 1 + 2 + ... + 10 = 55
			expect(result).toBe(55)
		})
	})

	describe("factorial", () => {
		it("should calculate factorial", () => {
			const result = Effect.runSync(Exercise.factorial(5))
			// 5! = 120
			expect(result).toBe(120)
		})

		it("should return 1 for 0", () => {
			const result = Effect.runSync(Exercise.factorial(0))
			expect(result).toBe(1)
		})

		it("should return 1 for 1", () => {
			const result = Effect.runSync(Exercise.factorial(1))
			expect(result).toBe(1)
		})

		it("should calculate 10!", () => {
			const result = Effect.runSync(Exercise.factorial(10))
			// 10! = 3628800
			expect(result).toBe(3628800)
		})
	})

	describe("processArray", () => {
		it("should double all numbers", () => {
			const result = Effect.runSync(Exercise.processArray([1, 2, 3]))
			expect(result).toEqual([2, 4, 6])
		})

		it("should handle empty array", () => {
			const result = Effect.runSync(Exercise.processArray([]))
			expect(result).toEqual([])
		})
	})

	describe("filterAndMap", () => {
		it("should filter even numbers and double them", () => {
			const result = Effect.runSync(Exercise.filterAndMap([1, 2, 3, 4, 5]))
			// Even: [2, 4], doubled: [4, 8]
			expect(result).toEqual([4, 8])
		})

		it("should return empty array if no even numbers", () => {
			const result = Effect.runSync(Exercise.filterAndMap([1, 3, 5]))
			expect(result).toEqual([])
		})

		it("should handle all even numbers", () => {
			const result = Effect.runSync(Exercise.filterAndMap([2, 4, 6]))
			expect(result).toEqual([4, 8, 12])
		})
	})

	describe("sequentialVsParallel", () => {
		it("should return same results for both strategies", () => {
			const result = Effect.runSync(
				Exercise.sequentialVsParallel([1, 2, 3]),
			)
			const [sequential, parallel] = result
			expect(sequential).toEqual([2, 4, 6])
			expect(parallel).toEqual([2, 4, 6])
		})

		it("should handle empty array", () => {
			const result = Effect.runSync(Exercise.sequentialVsParallel([]))
			const [sequential, parallel] = result
			expect(sequential).toEqual([])
			expect(parallel).toEqual([])
		})
	})
})
