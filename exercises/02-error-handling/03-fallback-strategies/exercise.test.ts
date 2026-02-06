import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit, Ref } from "effect"
import * as Exercise from "./exercise"

describe("03-fallback-strategies", () => {
	describe("withFallback", () => {
		it("should use primary if it succeeds", () => {
			const primary = Effect.succeed("primary")
			const fallback = Effect.succeed("fallback")
			const result = Effect.runSync(Exercise.withFallback(primary, fallback))
			expect(result).toBe("primary")
		})

		it("should use fallback if primary fails", () => {
			const primary = Effect.fail("error")
			const fallback = Effect.succeed("fallback")
			const result = Effect.runSync(Exercise.withFallback(primary, fallback))
			expect(result).toBe("fallback")
		})
	})

	describe("retryThreeTimes", () => {
		it("should succeed on first try", () => {
			const effect = Effect.succeed(42)
			const result = Effect.runSync(Exercise.retryThreeTimes(effect))
			expect(result).toBe(42)
		})

		it("should retry on failure", () => {
			const program = Effect.gen(function* () {
				const counter = yield* Ref.make(0)

				const effect = Ref.updateAndGet(counter, (n) => n + 1).pipe(
					Effect.flatMap((count) =>
						count < 3 ? Effect.fail("not yet") : Effect.succeed(count),
					),
				)

				return yield* Exercise.retryThreeTimes(effect)
			})

			const result = Effect.runSync(program)
			expect(result).toBe(3)
		})
	})

	describe("withTimeout", () => {
		it("should succeed if completes in time", async () => {
			const fast = Effect.sleep("100 millis").pipe(
				Effect.andThen(Effect.succeed(42)),
			)
			const result = await Effect.runPromise(Exercise.withTimeout(fast))
			expect(result).toBe(42)
		})

		it("should fail with timeout if takes too long", async () => {
			const slow = Effect.sleep("2 seconds").pipe(
				Effect.andThen(Effect.succeed(42)),
			)
			const exit = await Effect.runPromise(
				Effect.exit(Exercise.withTimeout(slow)),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("retryWithExponentialBackoff", () => {
		it("should succeed immediately if no error", () => {
			const effect = Effect.succeed(42)
			const result = Effect.runSync(
				Exercise.retryWithExponentialBackoff(effect),
			)
			expect(result).toBe(42)
		})

		it("should retry with backoff", () => {
			const program = Effect.gen(function* () {
				const counter = yield* Ref.make(0)

				const effect = Ref.updateAndGet(counter, (n) => n + 1).pipe(
					Effect.flatMap((count) =>
						count < 2 ? Effect.fail("retry") : Effect.succeed(count),
					),
				)

				return yield* Exercise.retryWithExponentialBackoff(effect)
			})

			const result = Effect.runSync(program)
			expect(result).toBeGreaterThanOrEqual(2)
		})
	})

	describe("robustOperation", () => {
		it("should return success if operation succeeds", () => {
			const operation = Effect.succeed(42)
			const result = Effect.runSync(
				Exercise.robustOperation(operation, 0),
			)
			expect(result).toBe(42)
		})

		it("should return fallback if operation fails after retries", () => {
			const operation = Effect.fail("permanent error")
			const result = Effect.runSync(
				Exercise.robustOperation(operation, 99),
			)
			expect(result).toBe(99)
		})

		it("should handle timeout", async () => {
			const operation = Effect.sleep("10 seconds").pipe(
				Effect.andThen(Effect.succeed(42)),
			)
			const result = await Effect.runPromise(
				Exercise.robustOperation(operation, 99),
			)
			expect(result).toBe(99)
		})
	})
})
