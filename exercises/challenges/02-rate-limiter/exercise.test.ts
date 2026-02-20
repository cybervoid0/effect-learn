import { describe, it, expect } from "vitest"
import { Effect, Either, Scope } from "effect"
import {
	RateLimited,
	RateLimiter,
	rateLimiterLive,
	rateLimitedForEach,
	retryAfterLimit,
} from "./exercise"

const MAX_CALLS = 3
const WINDOW_MS = 500

const withLimiter = <A, E>(
	program: Effect.Effect<A, E, RateLimiter>,
): Effect.Effect<A, E, never> =>
	program.pipe(
		Effect.provide(rateLimiterLive(MAX_CALLS, WINDOW_MS)),
		Effect.scoped,
	)

describe("challenges / 02-rate-limiter", () => {
	describe("RateLimited error", () => {
		it("should be a tagged error with remainingMs", () => {
			const error = new RateLimited({ remainingMs: 250 })
			expect(error._tag).toBe("RateLimited")
			expect(error.remainingMs).toBe(250)
		})
	})

	describe("RateLimiter service", () => {
		it("should allow calls under the limit", async () => {
			const program = Effect.gen(function* () {
				const limiter = yield* RateLimiter
				const r1 = yield* limiter.attempt(Effect.succeed("a"))
				const r2 = yield* limiter.attempt(Effect.succeed("b"))
				const r3 = yield* limiter.attempt(Effect.succeed("c"))
				return [r1, r2, r3]
			})
			const result = await Effect.runPromise(withLimiter(program))
			expect(result).toEqual(["a", "b", "c"])
		})

		it("should reject calls over the limit", async () => {
			const program = Effect.gen(function* () {
				const limiter = yield* RateLimiter
				yield* limiter.attempt(Effect.succeed(1))
				yield* limiter.attempt(Effect.succeed(2))
				yield* limiter.attempt(Effect.succeed(3))
				return yield* limiter.attempt(Effect.succeed(4)).pipe(
					Effect.catchTag("RateLimited", (e) =>
						Effect.succeed(`limited:${e.remainingMs > 0}`),
					),
				)
			})
			const result = await Effect.runPromise(withLimiter(program))
			expect(result).toBe("limited:true")
		})

		it("remaining should reflect available calls", async () => {
			const program = Effect.gen(function* () {
				const limiter = yield* RateLimiter
				const before = yield* limiter.remaining
				yield* limiter.attempt(Effect.succeed("x"))
				const after = yield* limiter.remaining
				return { before, after }
			})
			const result = await Effect.runPromise(withLimiter(program))
			expect(result.before).toBe(MAX_CALLS)
			expect(result.after).toBe(MAX_CALLS - 1)
		})

		it("reset should restore all calls", async () => {
			const program = Effect.gen(function* () {
				const limiter = yield* RateLimiter
				yield* limiter.attempt(Effect.succeed(1))
				yield* limiter.attempt(Effect.succeed(2))
				yield* limiter.reset
				const remaining = yield* limiter.remaining
				return remaining
			})
			const result = await Effect.runPromise(withLimiter(program))
			expect(result).toBe(MAX_CALLS)
		})

		it("should auto-reset after window expires", async () => {
			const program = Effect.gen(function* () {
				const limiter = yield* RateLimiter
				yield* limiter.attempt(Effect.succeed(1))
				yield* limiter.attempt(Effect.succeed(2))
				yield* limiter.attempt(Effect.succeed(3))
				// Wait for window to expire
				yield* Effect.sleep(WINDOW_MS + 100)
				// Should work again
				return yield* limiter.attempt(Effect.succeed("after-reset"))
			})
			const result = await Effect.runPromise(withLimiter(program))
			expect(result).toBe("after-reset")
		})
	})

	describe("rateLimitedForEach", () => {
		it("should collect successes and rate-limit errors", async () => {
			const effects = [1, 2, 3, 4, 5].map((n) =>
				Effect.succeed(n),
			)

			const program = rateLimitedForEach(effects)
			const result = await Effect.runPromise(withLimiter(program))

			const successes = result.filter(Either.isRight)
			const failures = result.filter(Either.isLeft)

			expect(successes).toHaveLength(MAX_CALLS)
			expect(failures).toHaveLength(2)
		})
	})

	describe("retryAfterLimit", () => {
		it("should succeed immediately when under limit", async () => {
			const program = retryAfterLimit(Effect.succeed("ok"))
			const result = await Effect.runPromise(withLimiter(program))
			expect(result).toBe("ok")
		})

		it("should retry after sleeping when rate limited", async () => {
			const program = Effect.gen(function* () {
				const limiter = yield* RateLimiter
				// Exhaust the limit
				yield* limiter.attempt(Effect.succeed(1))
				yield* limiter.attempt(Effect.succeed(2))
				yield* limiter.attempt(Effect.succeed(3))
				// This should sleep and retry after window reset
				return yield* retryAfterLimit(Effect.succeed("retried"))
			})
			const result = await Effect.runPromise(withLimiter(program))
			expect(result).toBe("retried")
		})
	})
})
