import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("02-queue", () => {
	describe("offerAndTake", () => {
		it("should return 'hello' after offering and taking", async () => {
			const result = await Effect.runPromise(Exercise.offerAndTake)
			expect(result).toBe("hello")
		})
	})

	describe("multipleItems", () => {
		it("should return [1, 2, 3] after offering and taking all", async () => {
			const result = await Effect.runPromise(Exercise.multipleItems)
			expect(result).toEqual([1, 2, 3])
		})
	})

	describe("queueSize", () => {
		it("should return 3 after offering 3 items", async () => {
			const result = await Effect.runPromise(Exercise.queueSize)
			expect(result).toBe(3)
		})
	})

	describe("producerConsumer", () => {
		it("should return 15 (sum of 1+2+3+4+5)", async () => {
			const result = await Effect.runPromise(Exercise.producerConsumer)
			expect(result).toBe(15)
		})
	})

	describe("boundedBackpressure", () => {
		it("should return [1, 2, 3] demonstrating backpressure", async () => {
			const result = await Effect.runPromise(Exercise.boundedBackpressure)
			expect(result[0]).toBe(1)
			expect(result[1]).toBe(2)
			expect(result[2]).toBe(3)
		})
	})
})
