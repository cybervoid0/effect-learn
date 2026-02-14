import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("01-ref-basics", () => {
	describe("createAndGet", () => {
		it("should return 0 from a newly created Ref", async () => {
			const result = await Effect.runPromise(Exercise.createAndGet)
			expect(result).toBe(0)
		})
	})

	describe("setAndGet", () => {
		it("should return 42 after setting the Ref", async () => {
			const result = await Effect.runPromise(Exercise.setAndGet)
			expect(result).toBe(42)
		})
	})

	describe("updateRef", () => {
		it("should return 15 after updating Ref(10) by adding 5", async () => {
			const result = await Effect.runPromise(Exercise.updateRef)
			expect(result).toBe(15)
		})
	})

	describe("modifyRef", () => {
		it("should return 5 (length of 'hello') from Ref.modify", async () => {
			const result = await Effect.runPromise(Exercise.modifyRef)
			expect(result).toBe(5)
		})
	})

	describe("counter", () => {
		it("should return 0 when incremented 0 times", async () => {
			const result = await Effect.runPromise(Exercise.counter(0))
			expect(result).toBe(0)
		})

		it("should return 1 when incremented 1 time", async () => {
			const result = await Effect.runPromise(Exercise.counter(1))
			expect(result).toBe(1)
		})

		it("should return 100 when incremented 100 times", async () => {
			const result = await Effect.runPromise(Exercise.counter(100))
			expect(result).toBe(100)
		})
	})
})
