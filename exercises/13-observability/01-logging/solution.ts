import { Effect } from "effect"

/**
 * Log an info-level message and return "done"
 */
export const logMessage: Effect.Effect<string> = Effect.gen(function* () {
	yield* Effect.logInfo("Hello, Effect!")
	return "done"
})

/**
 * Log one message at each level and return "complete"
 */
export const logAtLevels: Effect.Effect<string> = Effect.gen(function* () {
	yield* Effect.logDebug("debug message")
	yield* Effect.logInfo("info message")
	yield* Effect.logWarning("warning message")
	yield* Effect.logError("error message")
	return "complete"
})

/**
 * Annotate logs with requestId and log "processing"
 */
export const annotatedLog: Effect.Effect<string> = Effect.gen(function* () {
	yield* Effect.logInfo("processing")
	return "annotated"
}).pipe(Effect.annotateLogs("requestId", "abc-123"))

/**
 * Wrap a logging effect with a log span
 */
export const logWithSpan: Effect.Effect<string> = Effect.gen(function* () {
	yield* Effect.logInfo("started")
	return "spanned"
}).pipe(Effect.withLogSpan("myOperation"))

/**
 * Conditionally log at different levels based on number sign
 */
export const conditionalLogging = (n: number): Effect.Effect<number> =>
	Effect.gen(function* () {
		if (n > 0) {
			yield* Effect.logInfo("positive")
		} else if (n === 0) {
			yield* Effect.logWarning("zero")
		} else {
			yield* Effect.logError("negative")
		}
		return n
	})
