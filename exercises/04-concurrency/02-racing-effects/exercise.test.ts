import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit } from "effect"
import * as Exercise from "./exercise"

describe("02-racing-effects", () => {
	describe("raceTwo", () => {
		it("should return the result of the faster effect", async () => {
			const fast = Effect.sleep("50 millis").pipe(Effect.as("fast"))
			const slow = Effect.sleep("200 millis").pipe(Effect.as("slow"))

			const result = await Effect.runPromise(Exercise.raceTwo(fast, slow))
			expect(result).toBe("fast")
		})

		it("should return the other when roles are reversed", async () => {
			const slow = Effect.sleep("200 millis").pipe(Effect.as("slow"))
			const fast = Effect.sleep("50 millis").pipe(Effect.as("fast"))

			const result = await Effect.runPromise(Exercise.raceTwo(slow, fast))
			expect(result).toBe("fast")
		})
	})

	describe("raceWithFallback", () => {
		it("should return the safe value when the fast one fails", async () => {
			const result = await Effect.runPromise(
				Exercise.raceWithFallback(50, 200, "safe-value"),
			)
			expect(result).toBe("safe-value")
		})
	})

	describe("raceAll", () => {
		it("should return the fastest result from multiple effects", async () => {
			const effects = [
				Effect.sleep("300 millis").pipe(Effect.as("C")),
				Effect.sleep("50 millis").pipe(Effect.as("A")),
				Effect.sleep("200 millis").pipe(Effect.as("B")),
			]

			const result = await Effect.runPromise(Exercise.raceAll(effects))
			expect(result).toBe("A")
		})
	})

	describe("firstSuccessful", () => {
		it("should return the first successful result", async () => {
			const effects = [
				Effect.fail("error1" as const),
				Effect.fail("error2" as const),
				Effect.succeed("success"),
			]

			const result = await Effect.runPromise(Exercise.firstSuccessful(effects))
			expect(result).toBe("success")
		})

		it("should fail if all effects fail", async () => {
			const effects = [
				Effect.fail("error1"),
				Effect.fail("error2"),
				Effect.fail("error3"),
			]

			const exit = await Effect.runPromiseExit(
				Exercise.firstSuccessful(effects),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("withTimeout", () => {
		it("should return the result if effect completes in time", async () => {
			const effect = Effect.sleep("50 millis").pipe(
				Effect.as("completed"),
			)

			const result = await Effect.runPromise(
				Exercise.withTimeout(effect, "1 second", "timed out"),
			)
			expect(result).toBe("completed")
		})

		it("should return fallback if effect times out", async () => {
			const effect = Effect.sleep("2 seconds").pipe(
				Effect.as("completed"),
			)

			const result = await Effect.runPromise(
				Exercise.withTimeout(effect, "100 millis", "timed out"),
			)
			expect(result).toBe("timed out")
		})
	})
})
