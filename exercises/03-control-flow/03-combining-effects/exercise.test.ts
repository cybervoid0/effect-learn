import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("03-combining-effects", () => {
	describe("zipTwo", () => {
		it("should combine two Effects into a tuple", () => {
			const result = Effect.runSync(
				Exercise.zipTwo(Effect.succeed(42), Effect.succeed("hello")),
			)
			expect(result).toEqual([42, "hello"])
		})

		it("should preserve types", () => {
			const result = Effect.runSync(
				Exercise.zipTwo(Effect.succeed(true), Effect.succeed(123)),
			)
			expect(result).toEqual([true, 123])
		})
	})

	describe("zipWithSum", () => {
		it("should sum two numbers", () => {
			const result = Effect.runSync(
				Exercise.zipWithSum(Effect.succeed(10), Effect.succeed(32)),
			)
			expect(result).toBe(42)
		})

		it("should work with negative numbers", () => {
			const result = Effect.runSync(
				Exercise.zipWithSum(Effect.succeed(-5), Effect.succeed(15)),
			)
			expect(result).toBe(10)
		})
	})

	describe("combineArray", () => {
		it("should combine array of Effects", () => {
			const result = Effect.runSync(
				Exercise.combineArray([
					Effect.succeed(1),
					Effect.succeed(2),
					Effect.succeed(3),
				]),
			)
			expect(result).toEqual([1, 2, 3])
		})

		it("should handle empty array", () => {
			const result = Effect.runSync(Exercise.combineArray([]))
			expect(result).toEqual([])
		})
	})

	describe("combineObject", () => {
		it("should combine object of Effects", () => {
			const result = Effect.runSync(
				Exercise.combineObject({
					name: Effect.succeed("John"),
					age: Effect.succeed(25),
					active: Effect.succeed(true),
				}),
			)
			expect(result).toEqual({
				name: "John",
				age: 25,
				active: true,
			})
		})
	})

	describe("parallelFetch", () => {
		it("should process IDs with concurrency limit", () => {
			const result = Effect.runSync(Exercise.parallelFetch([1, 2, 3, 4, 5]))
			expect(result).toEqual([
				"user-1",
				"user-2",
				"user-3",
				"user-4",
				"user-5",
			])
		})

		it("should handle empty array", () => {
			const result = Effect.runSync(Exercise.parallelFetch([]))
			expect(result).toEqual([])
		})

		it("should handle single ID", () => {
			const result = Effect.runSync(Exercise.parallelFetch([42]))
			expect(result).toEqual(["user-42"])
		})
	})
})
