import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("01-stream-basics", () => {
	describe("createSimpleStream", () => {
		it("should return [1, 2, 3]", async () => {
			const result = await Effect.runPromise(Exercise.createSimpleStream())
			expect(result).toEqual([1, 2, 3])
		})
	})

	describe("streamFromArray", () => {
		it("should return the same items from the array", async () => {
			const result = await Effect.runPromise(
				Exercise.streamFromArray(["hello", "world", "effect"]),
			)
			expect(result).toEqual(["hello", "world", "effect"])
		})

		it("should handle an empty array", async () => {
			const result = await Effect.runPromise(Exercise.streamFromArray([]))
			expect(result).toEqual([])
		})
	})

	describe("rangeStream", () => {
		it("should return numbers 1 through 10", async () => {
			const result = await Effect.runPromise(Exercise.rangeStream())
			expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
		})
	})

	describe("emptyStream", () => {
		it("should return an empty array", async () => {
			const result = await Effect.runPromise(Exercise.emptyStream())
			expect(result).toEqual([])
		})
	})

	describe("streamFromEffect", () => {
		it("should return [42]", async () => {
			const result = await Effect.runPromise(Exercise.streamFromEffect())
			expect(result).toEqual([42])
		})
	})
})
