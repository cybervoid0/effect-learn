import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("01-sink-basics", () => {
	describe("collectAll", () => {
		it("should collect [1, 2, 3, 4, 5]", async () => {
			const result = await Effect.runPromise(Exercise.collectAll())
			expect(result).toEqual([1, 2, 3, 4, 5])
		})
	})

	describe("sumElements", () => {
		it("should sum to 60", async () => {
			const result = await Effect.runPromise(Exercise.sumElements())
			expect(result).toBe(60)
		})
	})

	describe("countElements", () => {
		it("should count 4 elements", async () => {
			const result = await Effect.runPromise(Exercise.countElements())
			expect(result).toBe(4)
		})
	})

	describe("foldElements", () => {
		it("should fold until accumulator reaches 10", async () => {
			const result = await Effect.runPromise(Exercise.foldElements())
			expect(result).toBe(10)
		})
	})

	describe("forEachSink", () => {
		it("should append each element to produce [1, 2, 3]", async () => {
			const result = await Effect.runPromise(Exercise.forEachSink())
			expect(result).toEqual([1, 2, 3])
		})
	})
})
