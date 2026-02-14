import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("01-deferred", () => {
	describe("createAndComplete", () => {
		it("should return 'hello' after completing the Deferred", async () => {
			const result = await Effect.runPromise(Exercise.createAndComplete)
			expect(result).toBe("hello")
		})
	})

	describe("deferredWithFailure", () => {
		it("should return 'error' after catching the failed Deferred", async () => {
			const result = await Effect.runPromise(Exercise.deferredWithFailure)
			expect(result).toBe("error")
		})
	})

	describe("waitForSignal", () => {
		it("should return 42 after signaling the waiting fiber", async () => {
			const result = await Effect.runPromise(Exercise.waitForSignal)
			expect(result).toBe(42)
		})
	})

	describe("isDoneCheck", () => {
		it("should return [false, true] for before/after completion", async () => {
			const result = await Effect.runPromise(Exercise.isDoneCheck)
			expect(result[0]).toBe(false)
			expect(result[1]).toBe(true)
		})
	})

	describe("handshake", () => {
		it("should exchange 'pong' and 'ping' between two fibers", async () => {
			const result = await Effect.runPromise(Exercise.handshake)
			expect(result[0]).toBe("pong")
			expect(result[1]).toBe("ping")
		})
	})
})
