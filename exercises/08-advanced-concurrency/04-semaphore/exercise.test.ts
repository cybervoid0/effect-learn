import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("04-semaphore", () => {
	describe("basicPermit", () => {
		it("should return 42", async () => {
			const result = await Effect.runPromise(Exercise.basicPermit)
			expect(result).toBe(42)
		})
	})

	describe("limitConcurrency", () => {
		it("should have max concurrency ≤ 2", async () => {
			const result = await Effect.runPromise(Exercise.limitConcurrency)
			expect(result).toBeGreaterThan(0)
			expect(result).toBeLessThanOrEqual(2)
		})
	})

	describe("mutualExclusion", () => {
		it("should count exactly 10 with mutex protection", async () => {
			const result = await Effect.runPromise(Exercise.mutualExclusion)
			expect(result).toBe(10)
		})
	})

	describe("connectionPool", () => {
		it("should have max concurrency ≤ 3", async () => {
			const result = await Effect.runPromise(Exercise.connectionPool)
			expect(result).toBeGreaterThan(0)
			expect(result).toBeLessThanOrEqual(3)
		})
	})
})
