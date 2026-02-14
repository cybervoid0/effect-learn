import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("03-subscription-ref", () => {
	describe("createSubRef", () => {
		it("should return 0 from a newly created SubscriptionRef", async () => {
			const result = await Effect.runPromise(Exercise.createSubRef)
			expect(result).toBe(0)
		})
	})

	describe("updateAndRead", () => {
		it("should return 'end' after setting SubscriptionRef", async () => {
			const result = await Effect.runPromise(Exercise.updateAndRead)
			expect(result).toBe("end")
		})
	})

	describe("collectChanges", () => {
		it("should collect values from changes stream", async () => {
			const result = await Effect.runPromise(Exercise.collectChanges)
			expect(result).toHaveLength(3)
			expect(result[0]).toBe(0)
		})
	})

	describe("multipleSubscribers", () => {
		it("should deliver same values to both subscribers", async () => {
			const result = await Effect.runPromise(Exercise.multipleSubscribers)
			expect(result).toBe(true)
		})
	})

	describe("trackHistory", () => {
		it("should track all changes including initial value", async () => {
			const result = await Effect.runPromise(Exercise.trackHistory)
			expect(result).toHaveLength(4)
			expect(result[0]).toBe("a")
		})
	})
})
