import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("03-stream-combining", () => {
	describe("concatStreams", () => {
		it("should concatenate [1,2] and [3,4] into [1,2,3,4]", async () => {
			const result = await Effect.runPromise(Exercise.concatStreams())
			expect(result).toEqual([1, 2, 3, 4])
		})
	})

	describe("mergeStreams", () => {
		it("should contain all 6 elements from both streams", async () => {
			const result = await Effect.runPromise(Exercise.mergeStreams())
			expect(result).toHaveLength(6)
			expect(result).toEqual(expect.arrayContaining([1, 2, 3, 4, 5, 6]))
		})
	})

	describe("zipStreams", () => {
		it('should zip ["a","b","c"] with [1,2,3] into tuples', async () => {
			const result = await Effect.runPromise(Exercise.zipStreams())
			expect(result).toEqual([
				["a", 1],
				["b", 2],
				["c", 3],
			])
		})
	})

	describe("flatMapStream", () => {
		it("should flatMap [1,2,3] into [1,10,2,20,3,30]", async () => {
			const result = await Effect.runPromise(Exercise.flatMapStream())
			expect(result).toEqual([1, 10, 2, 20, 3, 30])
		})
	})

	describe("zipWithStream", () => {
		it("should add pairs to produce [11, 22, 33]", async () => {
			const result = await Effect.runPromise(Exercise.zipWithStream())
			expect(result).toEqual([11, 22, 33])
		})
	})
})
