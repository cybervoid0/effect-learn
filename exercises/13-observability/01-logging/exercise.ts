import { Effect } from "effect"

/**
 * TODO: Log an info-level message "Hello, Effect!" and return "done".
 * Use Effect.logInfo to emit the log message.
 */
export const logMessage: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Log one message at each level:
 * - Debug: "debug message"
 * - Info: "info message"
 * - Warning: "warning message"
 * - Error: "error message"
 * Then return "complete".
 */
export const logAtLevels: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Use Effect.annotateLogs to attach the annotation
 * requestId: "abc-123" to an effect that logs "processing" at info level,
 * then return "annotated".
 */
export const annotatedLog: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Use Effect.withLogSpan("myOperation") to wrap an effect that
 * logs "started" at info level and returns "spanned".
 */
export const logWithSpan: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Given a number n:
 * - If n > 0, log at info level: "positive"
 * - If n === 0, log at warning level: "zero"
 * - If n < 0, log at error level: "negative"
 * Return n.
 */
export const conditionalLogging = (n: number): Effect.Effect<number> => {
	// Your code here
	return Effect.succeed(0) // Replace with correct implementation
}
