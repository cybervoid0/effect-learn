import { describe, expect, it } from "@effect/vitest"
import { Effect, Logger } from "effect"
import * as Exercise from "./exercise"

describe("01-logging", () => {
	describe("logMessage", () => {
		it.effect("should return 'done' after logging", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.logMessage.pipe(
					Effect.provide(Logger.none),
				)
				expect(result).toBe("done")
			}),
		)
	})

	describe("logAtLevels", () => {
		it.effect("should return 'complete' after logging at all levels", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.logAtLevels.pipe(
					Effect.provide(Logger.none),
				)
				expect(result).toBe("complete")
			}),
		)
	})

	describe("annotatedLog", () => {
		it.effect("should return 'annotated' with annotated logs", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.annotatedLog.pipe(
					Effect.provide(Logger.none),
				)
				expect(result).toBe("annotated")
			}),
		)
	})

	describe("logWithSpan", () => {
		it.effect("should return 'spanned' with log span", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.logWithSpan.pipe(
					Effect.provide(Logger.none),
				)
				expect(result).toBe("spanned")
			}),
		)
	})

	describe("conditionalLogging", () => {
		it.effect("should return the positive number after info log", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.conditionalLogging(5).pipe(
					Effect.provide(Logger.none),
				)
				expect(result).toBe(5)
			}),
		)

		it.effect("should return zero after warning log", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.conditionalLogging(0).pipe(
					Effect.provide(Logger.none),
				)
				expect(result).toBe(0)
			}),
		)

		it.effect("should return the negative number after error log", () =>
			Effect.gen(function* () {
				const result = yield* Exercise.conditionalLogging(-3).pipe(
					Effect.provide(Logger.none),
				)
				expect(result).toBe(-3)
			}),
		)
	})
})
