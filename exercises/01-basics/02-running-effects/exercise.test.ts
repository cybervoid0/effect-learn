import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit, Fiber } from "effect"
import * as Exercise from "./exercise"

describe("02-running-effects", () => {
	describe("runSimpleEffect", () => {
		it("should run a synchronous effect and return the result", () => {
			const effect = Effect.succeed(42)
			const result = Exercise.runSimpleEffect(effect)
			expect(result).toBe(42)
		})
	})

	describe("runEffectWithExit", () => {
		it("should return Success exit for successful effect", () => {
			const effect = Effect.succeed(42)
			const exit = Exercise.runEffectWithExit(effect)
			expect(Exit.isSuccess(exit)).toBe(true)
			if (Exit.isSuccess(exit)) {
				expect(exit.value).toBe(42)
			}
		})

		it("should return Failure exit for failed effect", () => {
			const effect = Effect.fail("error")
			const exit = Exercise.runEffectWithExit(effect)
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("runAsyncEffect", () => {
		it("should run an asynchronous effect and return a promise", async () => {
			const effect = Effect.promise(() => Promise.resolve(42))
			const result = await Exercise.runAsyncEffect(effect)
			expect(result).toBe(42)
		})
	})

	describe("runEffectInBackground", () => {
		it("should run effect in background and return a fiber", async () => {
			const effect = Effect.succeed(42)
			const fiber = Exercise.runEffectInBackground(effect)
			expect(fiber).toBeDefined()

			// Wait for fiber to complete and check result
			const exit = await Effect.runPromise(Fiber.await(fiber))
			expect(Exit.isSuccess(exit)).toBe(true)
			if (Exit.isSuccess(exit)) {
				expect(exit.value).toBe(42)
			}
		})
	})
})
