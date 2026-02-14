import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("04-stream-error-handling", () => {
	describe("streamCatchAll", () => {
		it('should recover to ["recovered"]', async () => {
			const result = await Effect.runPromise(Exercise.streamCatchAll())
			expect(result).toEqual(["recovered"])
		})
	})

	describe("streamOrElse", () => {
		it('should fall back to ["fallback"]', async () => {
			const result = await Effect.runPromise(Exercise.streamOrElse())
			expect(result).toEqual(["fallback"])
		})
	})

	describe("streamWithRetry", () => {
		it('should retry once and return ["success"]', async () => {
			const result = await Effect.runPromise(Exercise.streamWithRetry())
			expect(result).toEqual(["success"])
		})
	})

	describe("partialStream", () => {
		it("should emit 1, 2 then recover with 0", async () => {
			const result = await Effect.runPromise(Exercise.partialStream())
			expect(result).toEqual([1, 2, 0])
		})
	})

	describe("streamEither", () => {
		it("should capture errors and successes as strings", async () => {
			const result = await Effect.runPromise(Exercise.streamEither())
			expect(result).toEqual(["right:2", "left:odd", "right:4"])
		})
	})
})
