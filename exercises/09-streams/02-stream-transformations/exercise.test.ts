import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("02-stream-transformations", () => {
	describe("mapStream", () => {
		it("should double each element to produce [2, 4, 6]", async () => {
			const result = await Effect.runPromise(Exercise.mapStream())
			expect(result).toEqual([2, 4, 6])
		})
	})

	describe("filterStream", () => {
		it("should keep only even numbers from 1-10", async () => {
			const result = await Effect.runPromise(Exercise.filterStream())
			expect(result).toEqual([2, 4, 6, 8, 10])
		})
	})

	describe("takeFromStream", () => {
		it("should take the first 5 elements", async () => {
			const result = await Effect.runPromise(Exercise.takeFromStream())
			expect(result).toEqual([1, 2, 3, 4, 5])
		})
	})

	describe("dropFromStream", () => {
		it("should drop 7 elements and return [8, 9, 10]", async () => {
			const result = await Effect.runPromise(Exercise.dropFromStream())
			expect(result).toEqual([8, 9, 10])
		})
	})

	describe("chainTransformations", () => {
		it("should filter even, square, take 3 to produce [4, 16, 36]", async () => {
			const result = await Effect.runPromise(
				Exercise.chainTransformations(),
			)
			expect(result).toEqual([4, 16, 36])
		})
	})
})
