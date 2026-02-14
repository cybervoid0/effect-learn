import { Effect, Metric } from "effect"

/**
 * TODO: Create a counter named "request_count",
 * increment it 3 times, and return 3.
 */
export const incrementCounter: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a gauge named "temperature",
 * set it to 36.6, and return 36.6.
 */
export const setGauge: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a histogram named "response_time" with linear boundaries
 * (start: 0, width: 10, count: 10). Track the value 42 using
 * Metric.update(histogram)(42) or equivalent, and return 42.
 */
export const trackWithHistogram: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Create a counter "http_requests", tag it with method: "GET"
 * using Metric.tagged("method", "GET"), increment it once,
 * and return "tagged".
 */
export const taggedCounter: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Create a counter "run_count". Use Ref to count iterations.
 * Increment the counter and Ref in an effect, then repeat that effect
 * 4 additional times (5 total) using Effect.repeat + Schedule.recurs(4).
 * Return the final Ref value (5).
 */
export const countAndReturn: Effect.Effect<number> = Effect.succeed(0) // Replace with correct implementation
