import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit } from "effect"
import * as Exercise from "./exercise"

describe("02-catching-errors", () => {
	describe("recoverFromError", () => {
		it("should return success value if no error", () => {
			const effect = Effect.succeed(42)
			const result = Effect.runSync(Exercise.recoverFromError(effect, 0))
			expect(result).toBe(42)
		})

		it("should return fallback value on error", () => {
			const effect = Effect.fail("error")
			const result = Effect.runSync(Exercise.recoverFromError(effect, 99))
			expect(result).toBe(99)
		})
	})

	describe("recoverFromNetworkError", () => {
		it("should recover from NetworkError", () => {
			const effect = Effect.fail(
				new Exercise.NetworkError({ message: "timeout" }),
			)
			const result = Effect.runSync(Exercise.recoverFromNetworkError(effect))
			expect(result).toContain("Network error")
			expect(result).toContain("timeout")
		})

		it("should not catch ValidationError", () => {
			const effect = Effect.fail(
				new Exercise.ValidationError({ field: "email" }),
			)
			const exit = Effect.runSyncExit(
				Exercise.recoverFromNetworkError(effect),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should pass through success", () => {
			const effect = Effect.succeed("success")
			const result = Effect.runSync(Exercise.recoverFromNetworkError(effect))
			expect(result).toBe("success")
		})
	})

	describe("retryOnRetryableError", () => {
		it("should retry on retryable error", () => {
			const effect = Effect.fail("retryable: network issue")
			const result = Effect.runSync(Exercise.retryOnRetryableError(effect))
			expect(result).toBe("retried")
		})

		it("should not retry on non-retryable error", () => {
			const effect = Effect.fail("fatal error")
			const exit = Effect.runSyncExit(Exercise.retryOnRetryableError(effect))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should pass through success", () => {
			const effect = Effect.succeed("success")
			const result = Effect.runSync(Exercise.retryOnRetryableError(effect))
			expect(result).toBe("success")
		})
	})

	describe("matchResult", () => {
		it("should format success", () => {
			const effect = Effect.succeed(42)
			const result = Effect.runSync(Exercise.matchResult(effect))
			expect(result).toBe("Result: 42")
		})

		it("should format failure", () => {
			const effect = Effect.fail("oops")
			const result = Effect.runSync(Exercise.matchResult(effect))
			expect(result).toBe("Error: oops")
		})
	})

	describe("chainWithErrorHandling", () => {
		it("should parse and process valid number", () => {
			const result = Effect.runSync(Exercise.chainWithErrorHandling("10"))
			expect(result).toBe(20)
		})

		it("should fail on invalid number", () => {
			const exit = Effect.runSyncExit(Exercise.chainWithErrorHandling("abc"))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should cap at 100 when result is too large", () => {
			const result = Effect.runSync(Exercise.chainWithErrorHandling("60"))
			// 60 * 2 = 120 > 100, should return 100
			expect(result).toBe(100)
		})

		it("should return actual value when not too large", () => {
			const result = Effect.runSync(Exercise.chainWithErrorHandling("40"))
			// 40 * 2 = 80 <= 100
			expect(result).toBe(80)
		})
	})
})
