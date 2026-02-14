import { describe, expect, it } from "@effect/vitest"
import { Effect, Schedule } from "effect"
import * as Exercise from "./solution"

describe("01-schedule-basics", () => {
	it.effect("repeatNTimes should return 4 (1 initial + 3 repeats)", () =>
		Effect.gen(function* () {
			const result = yield* Exercise.repeatNTimes
			expect(result).toBe(4)
		})
	)

	it.effect("retryWithRecurs should return 3 after retrying until attempts reach 3", () =>
		Effect.gen(function* () {
			const result = yield* Exercise.retryWithRecurs
			expect(result).toBe(3)
		})
	)

	it("exponentialRetry should be a valid schedule", () => {
		expect(Exercise.exponentialRetry).toBeDefined()
	})

	it.effect("exponentialRetry should cap at 3 retries", () =>
		Effect.gen(function* () {
			let attempts = 0
			const result = yield* Effect.gen(function* () {
				attempts++
				if (attempts <= 3) {
					return yield* Effect.fail("retry")
				}
				return "success"
			}).pipe(Effect.retry(Exercise.exponentialRetry))
			expect(result).toBe("success")
			expect(attempts).toBe(4)
		})
	)

	it.effect("repeatWhile should return 5", () =>
		Effect.gen(function* () {
			const result = yield* Exercise.repeatWhile
			expect(result).toBe(5)
		})
	)

	it.effect("retryOrElse should return 'fallback' after exhausting retries", () =>
		Effect.gen(function* () {
			const result = yield* Exercise.retryOrElse
			expect(result).toBe("fallback")
		})
	)
})
