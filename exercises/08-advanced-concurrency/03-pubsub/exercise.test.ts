import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("03-pubsub", () => {
	describe("publishAndReceive", () => {
		it("should receive 'hello' after publishing", async () => {
			const result = await Effect.runPromise(Exercise.publishAndReceive)
			expect(result).toBe("hello")
		})
	})

	describe("multipleSubscribers", () => {
		it("should deliver the same message to both subscribers", async () => {
			const result = await Effect.runPromise(Exercise.multipleSubscribers)
			expect(result).toEqual(["msg", "msg"])
		})
	})

	describe("publishMany", () => {
		it("should receive all published numbers in order", async () => {
			const result = await Effect.runPromise(Exercise.publishMany)
			expect(result).toEqual([1, 2, 3])
		})
	})

	describe("fanOut", () => {
		it("should deliver broadcast to all 3 subscribers", async () => {
			const result = await Effect.runPromise(Exercise.fanOut)
			expect(result).toBe(3)
		})
	})

	describe("pubsubWithProcessing", () => {
		it("should return sum of 1+2+3+4+5 = 15", async () => {
			const result = await Effect.runPromise(Exercise.pubsubWithProcessing)
			expect(result).toBe(15)
		})
	})
})
